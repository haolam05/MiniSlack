import re
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField
from wtforms.validators import DataRequired, ValidationError
from urllib.request import urlopen
from app.models import User
from ..api.aws_helpers import ALLOWED_EXTENSIONS


def user_exists(form, field):
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


def validate_email(form, field):
    regex = r"^[^@]+@[^@]+\.[^@]+$"
    if not bool(re.match(regex, field.data)):
        raise ValidationError('Email is invalid.')


def username_check_len(form, field):
    if len(field.data) < 4:
         raise ValidationError('Username must be at least 4 characters.')


def password_check_len(form, field):
    if len(field.data) < 6:
         raise ValidationError('Password must be at least 6 characters.')


def validate_photo_url(form, field):
    if (field.data):
        try:
            content_type = urlopen(field.data).info()["content-type"]
        except:
            raise ValidationError("Must be a valid URL.")
        if "image" not in content_type:
            raise ValidationError("Photo must be a valid image URL!")
        return False


class SignUpForm(FlaskForm):
    first_name = StringField("First name", validators=[DataRequired()])
    last_name = StringField("Last name", validators=[DataRequired()])
    username = StringField('Username', validators=[DataRequired(), username_check_len, username_exists])
    email = StringField('Email', validators=[DataRequired(), validate_email, user_exists ])
    password = StringField('Password', validators=[DataRequired(), password_check_len])
    profile_image_url = FileField("Profile Image Url", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
