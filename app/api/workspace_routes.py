from flask import Blueprint, request
from sqlalchemy.exc import SQLAlchemyError
from flask_login import login_required, current_user
from ..models import  db, Workspace

workspace_routes = Blueprint("workspace", __name__)


@workspace_routes.route("/")
@login_required
def workspaces():
    """Get all workspaces joined or owned by the current signed in user"""
    user_owned_workspaces = [workspace.to_dict() for workspace in current_user.user_workspaces]
    user_joined_workspaces = [workspace.to_dict() for workspace in current_user.workspaces]
    return { "JoinedWorkspaces": user_joined_workspaces, "OwnedWorkspaces": user_owned_workspaces }


@workspace_routes.route("/<int:id>")
@login_required
def workspace(id):
    """Get a workspace details by id"""
    workspace = Workspace.query.get(id)

    if not workspace:
        return { "message": "Workspace couldn't be found" }, 404

    owner = workspace.owner.to_dict()
    members = [user.to_dict() for user in workspace.users]
    channels = [channel.to_dict() for channel in workspace.channels]

    return { **workspace.to_dict(), "Owner": owner, "Members": members, "Channels": channels }


# @workspace_routes.route("/", methods=["POST"])
# def create_workspace():
#     data = request.json
#     result = Workspace.validate(data)

#     if (result != True):
#         return result

#     new_workspace = Workspace(**data)
#     db.session.add(new_workspace)
#     db.session.commit()

#     return new_workspace.to_dict(), 201


# @workspace_routes.route("/", methods=["PUT"])
# def update_workspace():
#     pass


# @workspace_routes.route("/", methods=["DELETE"])
# def delete_workspace():
#     pass
