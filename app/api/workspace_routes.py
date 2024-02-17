from flask import Blueprint, request, redirect
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
    """Get a workspace details by id, log in the workspace"""
    workspace = Workspace.query.get(id)

    if not workspace:
        return { "message": "Workspace couldn't be found" }, 404

    owner = workspace.owner.to_dict()
    members = [user.to_dict() for user in workspace.users]
    channels = [channel.to_dict() for channel in workspace.channels]

    return { **workspace.to_dict(), "Owner": owner, "Members": members, "Channels": channels }


@workspace_routes.route("/", methods=["POST"])
@login_required
def create_workspace():
    data = request.json
    result = Workspace.validate(data)
    user_id = current_user.to_dict()["id"]

    if (result != True):
        return result

    data["owner_id"] = user_id
    new_workspace = Workspace(**data)
    db.session.add(new_workspace)
    db.session.commit()

    return new_workspace.to_dict(), 201


# @workspace_routes.route("/", methods=["PUT"])
# def update_workspace():
    # user = current_user.to_dict()
    # if user["id"]:
    #     return redirect("/api/auth/forbidden")
#     pass


# @workspace_routes.route("/", methods=["DELETE"])
# def delete_workspace():
#     pass
