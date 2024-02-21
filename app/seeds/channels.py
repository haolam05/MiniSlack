from sqlalchemy.sql import text
from ..models import db, Channel, Workspace, User
from ..models.db import environment, SCHEMA


def seed_channels():
    username_to_ids = User.username_to_ids()
    workspace_name_to_ids = Workspace.name_to_ids()

    channels = [
        {
            "name": "general",
            "owner_id": username_to_ids["haolam"],
            "workspace_id": workspace_name_to_ids["aA Union"]
        },
        {
            "name": "homework discussion",
            "owner_id": username_to_ids["nickyli"],
            "workspace_id": workspace_name_to_ids["aA Union"]
        },
        {
            "name": "assessments",
            "owner_id": username_to_ids["haolam"],
            "workspace_id": workspace_name_to_ids["aA Union"]
        },
        {
            "name": "general",
            "owner_id": username_to_ids["haolam"],
            "workspace_id": workspace_name_to_ids["hao-nick-nicky"]
        },
        {
            "name": "random",
            "owner_id": username_to_ids["nickyli"],
            "workspace_id": workspace_name_to_ids["hao-nick-nicky"]
        },
        {
            "name": "lecture questions",
            "owner_id": username_to_ids["haolam"],
            "workspace_id": workspace_name_to_ids["hao-nick-nicky"]
        },

    ]

    [db.session.add(Channel(**channel)) for channel in channels]
    db.session.commit()


def undo_channels():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.channels RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM channels"))

    db.session.commit()
