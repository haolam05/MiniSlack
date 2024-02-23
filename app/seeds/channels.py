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
            "workspace_id": workspace_name_to_ids["aA Union"],
            "topic": "Having fun everyday!",
            "description": "We have fun together everyday. Come and join us..."
        },
        {
            "name": "homework discussion",
            "owner_id": username_to_ids["nickyli"],
            "workspace_id": workspace_name_to_ids["aA Union"],
            "topic": "Work hard play hard!",
            "description": "We discuss homework everyday. Come and join us..."
        },
        {
            "name": "assessments",
            "owner_id": username_to_ids["haolam"],
            "workspace_id": workspace_name_to_ids["aA Union"],
            "topic": "Chill chill chill...",
            "description": "We chill everyday. Come and join us..."
        },
        {
            "name": "general",
            "owner_id": username_to_ids["haolam"],
            "workspace_id": workspace_name_to_ids["javascript-devs"],
            "topic": "Study group 🐼",
            "description": "We study everyday. Come and join us..."
        },
        {
            "name": "random",
            "owner_id": username_to_ids["nickyli"],
            "workspace_id": workspace_name_to_ids["javascript-devs"],
            "topic": "Movie everyday 🐷",
            "description": "We watch movie everyday. Come and join us..."
        },
        {
            "name": "lecture questions",
            "owner_id": username_to_ids["haolam"],
            "workspace_id": workspace_name_to_ids["javascript-devs"],
            "topic": "Having fun everyday!",
            "description": "We ask questions everyday. Come and join us..."
        },
        {
            "name": "general",
            "owner_id": username_to_ids["nickyli"],
            "workspace_id": workspace_name_to_ids["python-devs"],
            "topic": "anything and everything!",
            "description": "this is our general channel"
        },
        {
            "name": "syntax questions",
            "owner_id": username_to_ids["nickyli"],
            "workspace_id": workspace_name_to_ids["python-devs"],
            "topic": "python syntax questions!",
            "description": "come here if you get confuse js and py syntax"
        },
        {
            "name": "flask-help",
            "owner_id": username_to_ids["haolam"],
            "workspace_id": workspace_name_to_ids["python-devs"],
            "topic": "get help with flask",
            "description": "a supportive channel where you can discuss your flask troubles"
        },
        {
            "name": "python memes",
            "owner_id": username_to_ids["nickleger"],
            "workspace_id": workspace_name_to_ids["python-devs"],
            "topic": "python memes",
            "description": "python memes only please!"
        },
        {
            "name": "hash maps",
            "owner_id": username_to_ids["haolam"],
            "workspace_id": workspace_name_to_ids["DSNA"],
            "topic": "maps yeah",
            "description": "maps yeeee"
        },
        {
            "name": "weighted graphs",
            "owner_id": username_to_ids["nickyli"],
            "workspace_id": workspace_name_to_ids["DSNA"],
            "topic": "no ti-89",
            "description": "x and y??"
        },
        {
            "name": "basic linked lists",
            "owner_id": username_to_ids["nickleger"],
            "workspace_id": workspace_name_to_ids["DSNA"],
            "topic": "double or single?",
            "description": "it's up to you"
        },
        {
            "name": "flex vs grid",
            "owner_id": username_to_ids["nickleger"],
            "workspace_id": workspace_name_to_ids["css champs"],
            "topic": "can you center a div?",
            "description": "can i?"
        },
        {
            "name": "js vs css animations",
            "owner_id": username_to_ids["nickyli"],
            "workspace_id": workspace_name_to_ids["css champs"],
            "topic": "animations!!!",
            "description": "ux!"
        },
        {
            "name": "friday plans",
            "owner_id": username_to_ids["nickleger"],
            "workspace_id": workspace_name_to_ids["team building"],
            "topic": "plans after work",
            "description": "a group of us go downtown after work every friday. come join!"
        },
        {
            "name": "coffee heads",
            "owner_id": username_to_ids["haolam"],
            "workspace_id": workspace_name_to_ids["team building"],
            "topic": "coffee!",
            "description": "buzz buzz buzz"
        },
        {
            "name": "board games",
            "owner_id": username_to_ids["nickyli"],
            "workspace_id": workspace_name_to_ids["team building"],
            "topic": "board games on wednesday",
            "description": "come to floor 10 for games!"
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
