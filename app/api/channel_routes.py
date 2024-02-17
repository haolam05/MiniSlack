from flask import Blueprint, request
# from flask_login import login_required, current_user
# from ..models import  db, Channel

channel_routes = Blueprint("channels", __name__)


# @channel_routes.route("/")
# @login_required
# def channels():
#   """Get all channels"""

#   channels = Channel.query.all()
#   channels = [channel.to_dict() for channel in channels]
#   return channels
