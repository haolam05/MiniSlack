from sqlalchemy.sql import text
from ..models import db, Workspace, User
from ..models.db import environment, SCHEMA


def seed_workspaces():
    username_to_ids = User.username_to_ids()

    workspaces = [
        {
            "name": "aA Union",
            "owner_id": username_to_ids["luffy"]
        },
        {
            "name": "hao-nick-nicky",
            "owner_id": username_to_ids["luffy"]
        },
        {
            "name": "hao-nick",
            "owner_id": username_to_ids["luffy"]
        },
        {
            "name": "hao-nicky",
            "owner_id": username_to_ids["luffy"]
        },
        {
            "name": "nick-nicky",
            "owner_id": username_to_ids["luffy"]
        }
    ]

    [db.session.add(Workspace(**workspace)) for workspace in workspaces]
    db.session.commit()


def undo_workspaces():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.workspaces RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM workspaces"))

    db.session.commit()
