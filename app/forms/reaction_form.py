from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired


class ReactionForm(FlaskForm):
    encoded_text = StringField("Name", validators=[DataRequired()])
    workspace_id= IntegerField("Workspace ID", validators=[DataRequired()])
