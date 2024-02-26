import os, requests, json
from flask import Blueprint, request
from app.models import db, User, Message
from app.forms import LoginForm, SignUpForm, UpdateUserForm, UpdatePasswordForm
from flask_login import login_required, current_user, login_user, logout_user
from werkzeug.security import check_password_hash
from .aws_helpers import upload_file_to_s3, get_unique_filename
from ..socket import socketio, onlines

auth_routes = Blueprint('auth', __name__)


@auth_routes.route('/')
def authenticate():
    """Get Current User. Returns null if user is not signed in, a dictionary of user info if signed in."""
    if current_user.is_authenticated and current_user.is_deleted == False:
        return current_user.to_dict(), 200
    return { 'user': None }, 200


@auth_routes.route('/users')
@login_required
def get_all_users():
    """Get all users in MiniSlack"""
    users = [user.to_dict() for user in User.query.all()]
    return users, 200


@auth_routes.route('/<int:id>')
@login_required
def get_current_user(id):
    """Get the user by id"""
    user = User.query.get(id)

    if not user:
        return { "message": "User couldn't be found" }, 404

    return user.to_dict(), 200


@auth_routes.route("/emojis")
@login_required
def get_emojis():
    """Get emojis from Open Emoji API"""
    corruptedIcons = [
        "1FAE0", "1FAE1", "1FAE2", "1FAE3", "1FAE4", "1FAE5", "1FAE6", "1FAE8", "1F979", "1FA75",
        "1FA76", "1FA77", "1F9CC", "1FAF0", "1FAF1", "1FAF2", "1FAF3", "1FAF4", "1FAF5", "1FAF6",
        "1FAF7", "1FAF8", "1FAC3", "1FAC4", "1FAC5", "1FACE", "1FACF", "1FABD", "1FABF", "1FABA",
        "1FAB7", "1FAB8", "1FAB9", "1FABB", "1FABC", "1FAD7", "1FAD8", "1FAD9", "1FADA", "1FADB",
        "1F6D6", "1F6DC", "1F6DD", "1F6DE", "1F6Df", "1FAA9", "1FAAD", "1FAAE", "1FAAF", "1F7F0",
        "1FA7B", "1FA7C", "1FAAA", "1FAAC", "1FAE7", "1FAAB", "1FA87", "1FA88", "1F6DF"
    ]
    key = os.environ.get("OPEN_EMOJI_API_KEY")
    url = f"https://emoji-api.com/emojis?access_key={key}"
    res = requests.get(url)
    data = json.loads(res.text)
    emojis = [emoji for emoji in data if emoji["codePoint"] not in corruptedIcons and "🫱" not in emoji["character"]]
    return emojis, 200


@auth_routes.route('/update', methods=["PUT"])
@login_required
def update_user():
    """Update current user information. Returns the updated user."""
    form = UpdateUserForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        user = User.query.filter(User.email == form.data['email'] and User.is_deleted == False and user == current_user).first()

        if not user:
            return { "message": "User couldn't be found" }, 404

        if not check_password_hash(user.password, form.data["password"]):
            return { "password": "Password is incorrect" }, 400

        image = form.data["profile_image_url"]

        if image:
            image.filename = get_unique_filename(image.filename)
            upload = upload_file_to_s3(image)
            if "url" not in upload:
                return upload, 500
            user.profile_image_url = upload["url"]

        user.first_name = form.data["first_name"]
        user.last_name = form.data["last_name"]

        """ Emits update user event """
        socketio.emit("update_user", user.to_dict())

        db.session.commit()
        return user.to_dict()

    return form.errors, 400


@auth_routes.route('/password', methods=["PUT"])
@login_required
def update_user_password():
    """Update current user's password. Required to log in again after success update."""
    form = UpdatePasswordForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        if not check_password_hash(current_user.password, form.data["password"]):
            return { "password": "Password is incorrect" }, 400
        current_user.password = form.data["new_password"]

        db.session.commit()

        """ Emits logout event """
        for user_ids in onlines.values():
            if current_user.id in user_ids:
                user_ids.remove(current_user.id)
        socketio.emit("offline", onlines)

        logout_user()
        return { "message": "Successfully updated your password. Please log in again." }, 200

    return form.errors, 400


@auth_routes.route('/delete', methods=["DELETE"])
@login_required
def delete_user():
    """Delete current user. User's messages in channels are preserved."""

    if current_user.is_deleted == True:
        return { "message": "User couldn't be found" }, 404

    """ Delete user """
    current_user.is_deleted = True

    """ Delete workspaces joined by the user """
    for workspace in current_user.workspaces:
        socketio.emit("user_delete_member_leave", { "workspace": workspace.to_dict(), "member": current_user.to_dict() })
    current_user.workspaces = []

    """ Delete workspaces owned by the user """
    delete_workspace_ids = [workspace.id for workspace in current_user.user_workspaces]
    delete_workspace_names = [workspace.name for workspace in current_user.user_workspaces]
    for workspace in current_user.user_workspaces:
        member_ids = [member.id for member in workspace.users if member.id != current_user.id if member.is_deleted == False]
        socketio.emit("owner_delete_delete_workspace", { "member_ids": member_ids, "workspace": workspace.to_dict(), "owner": current_user.to_dict(), "deleted_workspace_ids": delete_workspace_ids, "deleted_workspace_names": delete_workspace_names })
        db.session.delete(workspace)

    """ Emits logout event """
    for user_ids in onlines.values():
        if current_user.id in user_ids:
            user_ids.remove(current_user.id)
    socketio.emit("offline", onlines)

    """ Logout """
    db.session.commit()
    logout_user()

    return { "message": "Successfully deleted account" }, 200


@auth_routes.route("/messages")
@login_required
def get_direct_messages():
    """Get all the direct messages of the current user"""
    user_id = current_user.id
    direct_messages = [m.to_dict(reactions=True) for m in Message.query.all() if m.is_private and (m.sender_id == user_id or m.receiver_id == user_id)]
    return { "Messages": direct_messages }, 200


@auth_routes.route('/login', methods=['POST'])
def login():
    """Login"""
    form = LoginForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        user = User.query.filter(User.email == form.data['email']).first()

        if user.is_deleted == True:
            return { "message": "User is already be deleted" }, 404

        login_user(user)
        return user.to_dict()

    return form.errors, 401


@auth_routes.route('/logout')
@login_required
def logout():
    """Logout"""

    """ Emits logout event """
    for user_ids in onlines.values():
        if current_user.id in user_ids:
            user_ids.remove(current_user.id)
    socketio.emit("offline", onlines)

    """ Logout """
    logout_user()
    return {'message': 'User logged out'}, 200


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """Signup"""
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        # if the dictionary doesn't have a url key
        # it means that there was an error when you tried to upload
        # so you send back that error message (and you printed it above)
        image = form.data["profile_image_url"]
        url = None
        if image:
            image.filename = get_unique_filename(image.filename)
            upload = upload_file_to_s3(image)
            if "url" not in upload:
                return upload, 500
            url = upload["url"]

        user = User(
            first_name=form.data["first_name"],
            last_name=form.data["last_name"],
            username=form.data["username"],
            email=form.data["email"],
            password=form.data["password"],
            profile_image_url=url
        )

        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict()

    return form.errors, 400


@auth_routes.route('/unauthorized')
def unauthorized():
    """User is not authorized. Please log in."""
    return { 'message': 'Unauthorized' }, 401


@auth_routes.route('/forbidden')
def forbidden():
    """User is forbbiden to perform this action."""
    return { 'message': 'Forbidden' }, 403
