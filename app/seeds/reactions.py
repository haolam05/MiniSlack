from sqlalchemy.sql import text
from ..models import db, User, Reaction
from ..models.db import environment, SCHEMA


def seed_reactions():
    username_to_ids = User.username_to_ids()

    reactions = [
        {
            "encoded_text": "😂",
            "user_id": username_to_ids["haolam"],
            "message_id": 3 # Do I know you???
        },
        {
            "encoded_text": "✅",
            "user_id": username_to_ids["nickylei"],
            "message_id": 4 #  Hey guys, let's start by introduce ourselves...
        },
        {
            "encoded_text": "✅",
            "user_id": username_to_ids["nickleger"],
            "message_id": 4 #  Hey guys, let's start by introduce ourselves...
        }
    ]

    [db.session.add(Reaction(**reaction)) for reaction in reactions]
    db.session.commit()


def undo_reactions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reactions"))

    db.session.commit()
