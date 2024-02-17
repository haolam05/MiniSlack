from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, ValidationError


def name_check_len(form, field):
    if len(field.data) < 4:
        raise ValidationError("Name must be at least 4 characters")


class ChannelForm(FlaskForm):
    name = StringField("name", validators=[DataRequired(), name_check_len])
    topic = StringField("topic")
    description = StringField("description")
