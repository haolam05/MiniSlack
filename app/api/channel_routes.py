from flask import Blueprint, request, redirect
from flask_login import login_required, current_user
from ..models import  db, Channel
from ..forms import ChannelForm

channel_routes = Blueprint("channels", __name__)


@channel_routes.route("/<int:id>", methods=['PUT'])
@login_required
def update_channel(id):
    """Update a channel of a workspace. Only channel's owner can edit the channel."""
    form = ChannelForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        channel = Channel.query.get(id)

        if not channel:
            return { "message": "Channel couldn't be found" }, 404

        if current_user != channel.owner:
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
        return channel.to_dict(), 200

    return form.errors, 400


"""Delete a channel of a workspace. Only Channel's owner and Workspace's owner can delete channel."""


# @channel_routes.route("/")
# @login_required
# def channels():
#   """Get all channels"""

#   channels = Channel.query.all()
#   channels = [channel.to_dict() for channel in channels]
#   return channels
