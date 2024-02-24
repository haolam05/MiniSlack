from flask import Blueprint, request, redirect
from flask_login import login_required, current_user
from ..socket import socketio
from ..models import  db, Workspace, Channel, User, Message
from ..forms import WorkspaceForm, ChannelForm, MembershipForm

workspace_routes = Blueprint("workspaces", __name__)


@workspace_routes.route("/")
@login_required
def workspaces():
    """Get all workspaces joined or owned by the current signed in user"""
    user_owned_workspaces = [workspace.to_dict() for workspace in current_user.user_workspaces]
    user_joined_workspaces = [workspace.to_dict() for workspace in current_user.workspaces]
    return { "JoinedWorkspaces": user_joined_workspaces, "OwnedWorkspaces": user_owned_workspaces }, 200


@workspace_routes.route("/<int:id>")
@login_required
def workspace(id):
    """Current user owned or as a member of the workspace can log in the workspace to get details"""
    workspace = Workspace.query.get(id)

    if not workspace:
        return { "message": "Workspace couldn't be found" }, 404

    if current_user not in workspace.users and current_user != workspace.owner:
        return redirect("/api/auth/forbidden")

    owner = workspace.owner.to_dict()
    members = [user.to_dict() for user in workspace.users]
    channels = [channel.to_dict() for channel in workspace.channels]

    return { **workspace.to_dict(), "Owner": owner, "Members": members, "Channels": channels }, 200


@workspace_routes.route("/", methods=["POST"])
@login_required
def create_workspace():
    """Create a new workspace"""
    form = WorkspaceForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        result = Workspace.validate(form.data)
        user_id = current_user.to_dict()["id"]

        if (result != True):
            return result

        new_workspace = Workspace(
            name=form.data["name"],
            owner_id=user_id
        )
        new_workspace.users.append(current_user)
        db.session.add(new_workspace)
        db.session.commit()

        return new_workspace.to_dict(), 201
    return form.errors, 400


@workspace_routes.route("/<int:id>", methods=["PUT"])
@login_required
def update_workspace(id):
    """Update a wokspace by id"""
    form = WorkspaceForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    workspace = Workspace.query.get(id)
    user_id = current_user.to_dict()['id']

    if form.validate_on_submit():
        if not workspace:
            return { "message": "Workspace couldn't be found" }, 404

        if user_id != workspace.owner_id:
            return redirect("/api/auth/forbidden")

        if form.data["name"] != workspace.name:
            result = Workspace.validate(form.data)
            if result != True:
                return result
            workspace.name = form.data["name"]
            db.session.commit()

        return workspace.to_dict(), 200
    return form.errors, 400


@workspace_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_workspace(id):
    """Delete the workspace specifed by id"""
    workspace = Workspace.query.get(id)

    if not workspace:
        return { "message": "Workspace couldn't be found" }, 404

    if current_user.id != workspace.owner_id:
        return redirect("/api/auth/forbidden")

    db.session.delete(workspace)
    db.session.commit()

    member_ids = [member.id for member in workspace.users if member.id != current_user.id]
    socketio.emit("delete_workspace", { "member_ids": member_ids, "workspace": workspace.to_dict() })

    return { "message": f"Successfully deleted {workspace.name} workspace" }


@workspace_routes.route("/<int:id>/channels")
@login_required
def channels(id):
    """Returns all channels that belonged to a workspace specifed by id. Only owner and members of workspace can see."""
    workspace = Workspace.query.get(id)

    if not workspace:
        return { "message": "Workspace couldn't be found" }, 404

    if current_user not in workspace.users and current_user != workspace.owner:
        return redirect("/api/auth/forbidden")

    channels = [channel.to_dict() for channel in workspace.channels]

    return { "Channels": channels }, 200


@workspace_routes.route("/<int:id>/channels", methods=['POST'])
@login_required
def create_channel(id):
    """Create a new channel for a workspace. Any workspace's member can create a channel."""
    form = ChannelForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        workspace = Workspace.query.get(id)
        user_id = current_user.to_dict()['id']

        if not workspace:
            return { "message": "Workspace couldn't be found" }, 404

        result = Channel.validate(form.data, id)
        if result != True:
            return result

        if current_user not in workspace.users and current_user != workspace.owner:
            return redirect("/api/auth/forbidden")

        new_channel = Channel(
            name=form.data["name"],
            topic=form.data["topic"],
            description=form.data["description"],
            owner_id=user_id,
            workspace_id=id
        )
        db.session.add(new_channel)
        db.session.commit()

        return new_channel.to_dict(), 200

    return form.errors, 400


@workspace_routes.route("/<int:id>/memberships")
@login_required
def memberships(id):
    """Returns all members that belonged to a workspace specifed by id"""
    workspace = Workspace.query.get(id)

    if not workspace:
        return { "message": "Workspace couldn't be found" }, 404

    if current_user not in workspace.users and current_user != workspace.owner:
        return redirect("/api/auth/forbidden")

    members = [{**member.to_dict(), "workspace_id": id} for member in workspace.users if member.is_deleted == False]

    return { "Members": members }, 200


@workspace_routes.route("/<int:id>/memberships", methods=['POST'])
@login_required
def create_membership(id):
    """Create a new membership for a workspace. Only workspace's owner can invite others."""
    form = MembershipForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        workspace = Workspace.query.get(id)
        user = User.query.filter(User.email == form.data["email"]).one_or_none()

        if not workspace:
            return { "message": "Workspace couldn't be found" }, 404

        if not user:
            return { "message": "User couldn't be found" }, 404

        if current_user != workspace.owner:
            return redirect("/api/auth/forbidden")

        if workspace in user.workspaces:
            return { "message": "User is already a member of the workspace" }, 500

        user.workspaces.append(workspace)
        db.session.commit()
        socketio.emit("invite_member", { "member_id": user.id, "workspace": workspace.to_dict() })
        return { "user_id": user.id, "workspace_id": workspace.id }, 200

    return form.errors, 400


@workspace_routes.route("/<int:workspace_id>/memberships/<int:user_id>", methods=['DELETE'])
@login_required
def delete_membership(workspace_id, user_id):
    """Delete a membership for a workspace. Only workspace's owner can remove member. User can leaves the workspace."""
    workspace = Workspace.query.get(workspace_id)
    user = User.query.get(user_id)

    if not workspace:
        return { "message": "Workspace couldn't be found" }, 404

    if not user:
        return { "message": "User couldn't be found" }, 404

    if workspace not in  user.workspaces:
        return { "message": "The user is not a member of this workspace" }, 500

    if current_user != workspace.owner and current_user != user:
        return redirect("/api/auth/forbidden")

    user.workspaces = [w for w in user.workspaces if w != workspace]

    if current_user == workspace.owner:
        socketio.emit("remove_member", { "member_id": user_id, "workspace": workspace.to_dict() })
    else:
        socketio.emit("member_leave", { "workspace": workspace.to_dict(), "member": user.to_dict() })

    db.session.commit()

    return { "message": f"Successfully removed {user.email} from {workspace.name} workspace" }


@workspace_routes.route("/<int:id>/all-memberships")
def get_all_memberships(id):
    """Returns all members(include deleted members) from the workspace (only if the member has ever sent a message)"""
    workspace = Workspace.query.get(id)

    if not workspace:
        return { "message": "Workspace couldn't be found" }, 404

    if current_user not in workspace.users and current_user != workspace.owner:
        return redirect("/api/auth/forbidden")

    active_members = workspace.users
    active_member_ids = [m.id for m in active_members]

    member_ids = [*active_member_ids]
    for message in Message.query.filter(Message.workspace_id == id):
        sender_id = message.sender_id
        receiver_id = message.receiver_id

        if sender_id not in member_ids:
            member_ids.append(sender_id)

        if receiver_id and receiver_id not in member_ids:
            member_ids.append(receiver_id)

    members = [{**User.query.get(member_id).to_dict(), "workspace_id": id} for member_id in member_ids]
    for member in members:
        member["removed"] = member["id"] not in active_member_ids
    return members, 200
