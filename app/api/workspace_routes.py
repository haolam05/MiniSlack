from flask import Blueprint, request, redirect
from sqlalchemy.exc import SQLAlchemyError
from flask_login import login_required, current_user
from ..models import  db, Workspace
from ..forms import WorkspaceForm

workspace_routes = Blueprint("workspace", __name__)


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
    """Get a workspace details by id, log in the workspace"""
    workspace = Workspace.query.get(id)

    if not workspace:
        return { "message": "Workspace couldn't be found" }, 404

    owner = workspace.owner.to_dict()
    members = [user.to_dict() for user in workspace.users]
    channels = [channel.to_dict() for channel in workspace.channels]

    return { **workspace.to_dict(), "Owner": owner, "Members": members, "Channels": channels }, 200


@workspace_routes.route("/", methods=["POST"])
@login_required
def create_workspace():
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
        db.session.add(new_workspace)
        db.session.commit()

        return new_workspace.to_dict(), 201
    return form.errors, 400


@workspace_routes.route("/<int:id>", methods=["PUT"])
@login_required
def update_workspace(id):
    data = Workspace()
    form = WorkspaceForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    form.populate_obj(data)
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


# @workspace_routes.route("/", methods=["DELETE"])
# def delete_workspace():
#     pass
