from flask import Blueprint, request, redirect
from flask_login import login_required, current_user
from ..socket import socketio
from ..models import  db, Channel, Message, Workspace
from ..forms import ChannelForm

channel_routes = Blueprint("channels", __name__)


@channel_routes.route("/<int:id>", methods=['PUT'])
@login_required
def update_channel(id):
    """Update a channel of a workspace. Only channel's owner or workspace's owner(that channel belongs to) can edit the channel."""
    form = ChannelForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        channel = Channel.query.get(id)
        old_name = channel.name

        if not channel:
            return { "message": "Channel couldn't be found" }, 404

        if current_user != channel.owner and current_user != channel.workspace.owner:
            return redirect("/api/auth/forbidden")

        new_name = form.data["name"] != channel.name
        result = Channel.validate(form.data, new_name)
        if result != True:
            return result

        channel.name = form.data["name"]
        if form.data["topic"]:
            channel.topic = form.data["topic"]

        if form.data["description"]:
            channel.description = form.data["description"]

        db.session.commit()
        workspace = Workspace.query.get(channel.workspace_id)
        member_ids = [member.id for member in workspace.users if member.id != current_user.id if member.is_deleted == False]
        socketio.emit("update_channel", { "member_ids": member_ids, "workspace": workspace.to_dict(), "channel": channel.to_dict(), "old_name": old_name })
        return channel.to_dict(), 200

    return form.errors, 400


@channel_routes.route("/<int:id>", methods=['DELETE'])
@login_required
def delete_channel(id):
    """Delete a channel of a workspace. Only Channel's owner and Workspace's owner can delete channel."""
    channel = Channel.query.get(id)

    if not channel:
        return { "message": "Channel couldn't be found" }, 404

    if current_user != channel.owner and current_user != channel.workspace.owner:
        return redirect("/api/auth/forbidden")

    db.session.delete(channel)
    db.session.commit()

    workspace = Workspace.query.get(channel.workspace_id)
    member_ids = [member.id for member in workspace.users if member.id != current_user.id if member.is_deleted == False]
    socketio.emit("delete_channel", { "member_ids": member_ids, "workspace": workspace.to_dict(), "channel": channel.to_dict() })

    return { "message": f"Successfully deleted {channel.name} channel" }


@channel_routes.route("/<int:id>/messages")
@login_required
def get_channel_messages(id):
    """Get all the messages of a channel in a workspace. Only Workspace members and Workspace's owner can see the channel's messages"""
    channel = Channel.query.get(id)
    user_joined_workspaces = current_user.workspaces
    user_owned_workspaces = current_user.user_workspaces

    if not channel:
        return { "message": "Channel couldn't be found" }, 404

    if channel.workspace not in user_joined_workspaces and channel.workspace not in user_owned_workspaces:
        return redirect("/api/auth/forbidden")

    messages = Message.query.filter(Message.channel_id == id).all()
    messages = [message.to_dict(reactions=True) for message in messages]

    return { "Messages": messages }, 200
