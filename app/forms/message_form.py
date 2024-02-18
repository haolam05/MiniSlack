from flask_wtf import FlaskForm
from wtforms import TextAreaField, IntegerField, BooleanField
from wtforms.validators import DataRequired


class MessageForm(FlaskForm):
    message = TextAreaField("Message", validators=[DataRequired()])
    workspace_id= IntegerField("Workspace ID", validators=[DataRequired()])
    is_private = BooleanField("Is Private")
    receiver_id = IntegerField("Receiver ID")
    channel_id = IntegerField("Channel ID")
