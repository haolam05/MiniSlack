from flask import Blueprint, request
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user

auth_routes = Blueprint('auth', __name__)


@auth_routes.route('/')
def authenticate():
    """Get Current User. Returns null if user is not signed in, a dictionary of user info if signed in."""
    if current_user.is_authenticated:
        return current_user.to_dict(), 200
    return { 'user': None }, 200


@auth_routes.route('/login', methods=['POST'])
def login():
    """Login"""
    form = LoginForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
        return user.to_dict()
    return form.errors, 401


@auth_routes.route('/logout')
def logout():
    """Logout"""
    logout_user()
    return {'message': 'User logged out'}, 200


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """Signup"""
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User(
            first_name=form.data["first_name"],
            last_name=form.data["last_name"],
            username=form.data['username'],
            email=form.data['email'],
            password=form.data['password'],
            profile_image_url=form.data["profile_image_url"]
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
    return { 'message': 'Forbiddedn' }, 403
