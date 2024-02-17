from flask import Blueprint
from flask_login import login_required
from app.models import Channel

channel_routes = Blueprint('channels', __name__)

@channel_routes.route('/')
def test_connection():
    return "channel blueprint works!!!!"
