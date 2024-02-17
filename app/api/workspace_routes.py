from flask import Blueprint
from flask_login import login_required
from app.models import workspace #lowercase 'w' for the file?

workspace_routes = Blueprint('workspace', __name__)

