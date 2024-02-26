from ..socket import socketio
from flask import Blueprint, request, redirect
from flask_login import login_required, current_user
from ..models import  db, Message, Workspace, Channel, User, Reaction
from ..forms import MessageForm
from ..forms import ReactionForm

message_routes = Blueprint("messages", __name__)


@message_routes.route("/", methods=['POST'])
@login_required
def create_message():
    """Create a new message"""
    form = MessageForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        """ Form Validations """
        result = Message.validate(form.data)
        if result != True:
            return result


        """ Workspace must exists """
        workspace = Workspace.query.get(form.data["workspace_id"])
        if not workspace:
            return { "message": "Workspace couldn't be found" }, 404


        """ Channel Messages - Channel has to belong to current workspace """
        if form.data["is_private"] == False:
            channel = Channel.query.get(form.data["channel_id"])
            if not channel:
                return { "message": "Channel couldn't be found" }, 404
            if channel.workspace != workspace:
                return redirect("/api/auth/forbidden")


        """ Private Messages - Receiver has to be a member or the owner of the current workspace """
        if form.data["is_private"] == True:
            user = User.query.get(form.data["receiver_id"])
            if not user:
                return { "message": "Receiver does not exists" }, 404
            if workspace not in user.workspaces and workspace not in user.user_workspaces:
                return redirect("/api/auth/forbidden")


        """ Current user(sender) must be a member or the owner of the current workspace """
        if workspace not in current_user.workspaces and workspace not in current_user.user_workspaces:
            return redirect("/api/auth/forbidden")


        """ Create a new message based on above info """
        new_message = Message(
            message=form.data["message"],
            is_private=form.data["is_private"],
            sender_id=current_user.id,
            receiver_id=form.data["receiver_id"],
            channel_id=form.data["channel_id"],
            workspace_id=form.data["workspace_id"]
        )
        db.session.add(new_message)
        db.session.commit()


        """ Returns new message """
        socketio.emit("new_message", new_message.to_dict(reactions=True))
        return new_message.to_dict(reactions=True), 200

    return form.errors, 400


@message_routes.route("/<int:id>", methods=['PUT'])
@login_required
def update_message(id):
    """Update a message"""
    form = MessageForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        message = Message.query.get(id)

        if not message:
            return { "message": "Message couldn't be found" }, 404

        result = Message.validate(form.data)
        if result != True:
            return result

        workspace = Workspace.query.get(form.data["workspace_id"])

        """ Current user must be the owner or a member of the current workspace and is the message owner to edit a message """
        if  (workspace not in current_user.workspaces and workspace not in current_user.user_workspaces) or current_user != message.owner:
            return redirect("/api/auth/forbidden")

        """ The type of message(public/private) that the user is trying to update must matched message's type in the body """
        if form.data["is_private"] == message.is_private:
            message.message = form.data["message"]

        db.session.commit()
        socketio.emit("update_message", message.to_dict(reactions=True))
        return message.to_dict(reactions=True), 200

    return form.errors, 400


@message_routes.route("/<int:id>", methods=['DELETE'])
@login_required
def delete_message(id):
    """Delete a message"""
    message = Message.query.get(id)

    if not message:
        return { "message": "Message couldn't be found" }, 404

    if current_user != message.owner:
        return redirect("/api/auth/forbidden")

    socketio.emit("delete_message", message.to_dict())

    db.session.delete(message)
    db.session.commit()

    return { "message": f"Successfully deleted {current_user.email}'s message" }


@message_routes.route("/<int:id>/reactions")
@login_required
def reactions(id):
    """Get all reactions of a message specified by id"""
    message = Message.query.get(id)

    if not message:
        return { "message": "Message couldn't be found" }, 404

    """ Message has to be inside a workspace that is owned or joined by the current user """
    if message.workspace not in current_user.workspaces and message.workspace not in current_user.user_workspaces:
        return redirect("/api/auth/forbidden")

    reactions = [reaction.to_dict() for reaction in message.reactions]
    return { "Reactions": reactions }, 200


@message_routes.route("/<int:id>/reactions", methods=['POST'])
@login_required
def create_reaction(id):
    """Create a new reaction for a message specified by id"""
    form = ReactionForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        message = Message.query.get(id)

        if not message:
            return { "message": "Message couldn't be found" }, 404

        result =  Reaction.validate(form.data)
        if result != True:
            return result

        """Message must be in a workspace where the current user is a member or an owner of."""
        if message.workspace not in current_user.workspaces and message.workspace not in current_user.user_workspaces:
            return redirect("/api/auth/forbidden")

        new_reaction = Reaction(
            encoded_text=form.data["encoded_text"],
            user_id=current_user.id,
            message_id=message.id
        )

        db.session.add(new_reaction)
        db.session.commit()

        reaction_json = { **new_reaction.to_dict(), "user": current_user.to_dict() }
        socketio.emit("create_reaction", { "message": message.to_dict(reactions=True), "new_reaction": reaction_json })
        return new_reaction.to_dict(), 200

    return form.errors, 400


@message_routes.route("/<int:message_id>/reactions/<int:reaction_id>", methods=['DELETE'])
@login_required
def delete_reaction(message_id, reaction_id):
    """Delete a reaction of a message specified by id"""
    message = Message.query.get(message_id)
    reaction = Reaction.query.get(reaction_id)

    if not message:
        return { "message": "Message couldn't be found" }, 404

    if not reaction:
        return { "message": "Reaction couldn't be found" }, 404

    """Message must be in a workspace where the current user is a member or an owner of. Current user must be owner of the reaction."""
    if (message.workspace not in current_user.workspaces and message.workspace not in current_user.user_workspaces) or reaction.message != message or reaction.user != current_user:
        return redirect("/api/auth/forbidden")

    db.session.delete(reaction)
    db.session.commit()

    socketio.emit("delete_reaction", { "message": message.to_dict(reactions=True), "reaction": reaction.to_dict() })
    return { "message": f"Successfully deleted reaction" }, 200
