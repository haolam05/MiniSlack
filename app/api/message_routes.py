from flask import Blueprint, request, redirect
from flask_login import login_required, current_user
from ..models import  db, Message, Workspace, Channel, User
from ..forms import MessageForm

message_routes = Blueprint("messages", __name__)


@message_routes.route("/", methods=['POST'])
@login_required
def create_message():
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
                return { "message": "Receiver does not exists" }
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
            channel_id=form.data["channel_id"]
        )
        db.session.add(new_message)
        db.session.commit()


        """ Returns new message """
        return new_message.to_dict(), 200

    return form.errors, 400
