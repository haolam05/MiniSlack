from sqlalchemy.sql import text
from ..models import db, User, Channel, Message, Workspace
from ..models.db import environment, SCHEMA


def seed_messages():
    username_to_ids = User.username_to_ids()
    c_w_to_ids = Channel.channel_and_workspace_name_to_ids()
    name_to_ids = Workspace.name_to_ids()

    messages = [
        {
            "is_private": True,
            "message": "Hi, my name is Hao",
            "sender_id": username_to_ids["haolam"],
            "receiver_id": username_to_ids["nickleger"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": True,
            "message": "Nice to meet you 😀",
            "sender_id": username_to_ids["haolam"],
            "receiver_id": username_to_ids["nickleger"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": True,
            "message": "Do I know you???",
            "sender_id": username_to_ids["nickleger"],
            "receiver_id": username_to_ids["haolam"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": True,
            "message": "Hi, my name is Hao",
            "sender_id": username_to_ids["haolam"],
            "receiver_id": username_to_ids["nickyli"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": True,
            "message": "Nice to meet you 😀",
            "sender_id": username_to_ids["haolam"],
            "receiver_id": username_to_ids["nickyli"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": True,
            "message": "Do I know you???",
            "sender_id": username_to_ids["nickyli"],
            "receiver_id": username_to_ids["haolam"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": True,
            "message": "What do you want? Get out of my face :)",
            "sender_id": username_to_ids["haolam"],
            "receiver_id": username_to_ids["nickyli"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": True,
            "message": "Tell me about yourself. How old are you? Where do you live? Tell me about yourself. How old are you? Where do you live? Tell me about yourself. How old are you? Where do you live? Tell me about yourself. How old are you? Where do you live? Tell me about yourself. How old are you? Where do you live?",
            "sender_id": username_to_ids["haolam"],
            "receiver_id": username_to_ids["nickyli"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": True,
            "message": "Seen ✅✅✅✅",
            "sender_id": username_to_ids["nickyli"],
            "receiver_id": username_to_ids["haolam"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": True,
            "message": "🤩🤩🤩🤩🤩🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🆗🆗🆗🆗🆗🆗🆗🆗🆗🆗🆗🆗🆗",
            "sender_id": username_to_ids["nickyli"],
            "receiver_id": username_to_ids["haolam"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": True,
            "message": "🤩🤩🤩🤩🤩🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🆗🆗🆗🆗🆗🆗🆗🆗🆗🆗🆗🆗🆗",
            "sender_id": username_to_ids["nickyli"],
            "receiver_id": username_to_ids["haolam"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": True,
            "message": "🤩🤩🤩🤩🤩🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🆗🆗🆗🆗🆗🆗🆗🆗🆗🆗🆗🆗🆗",
            "sender_id": username_to_ids["nickyli"],
            "receiver_id": username_to_ids["haolam"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": False,
            "message": "Hey guys, let's start by introduce ourselves...",
            "sender_id": username_to_ids["haolam"],
            "channel_id": c_w_to_ids["general:javascript-devs"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": False,
            "message": "My name is Nicky.",
            "sender_id": username_to_ids["nickyli"],
            "channel_id": c_w_to_ids["general:javascript-devs"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": False,
            "message": "I'm Nick",
            "sender_id": username_to_ids["nickleger"],
            "channel_id": c_w_to_ids["general:javascript-devs"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": False,
            "message": "Where are you from?",
            "sender_id": username_to_ids["haolam"],
            "channel_id": c_w_to_ids["general:javascript-devs"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": False,
            "message": "Not sure 🐷",
            "sender_id": username_to_ids["nickyli"],
            "channel_id": c_w_to_ids["general:javascript-devs"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": False,
            "message": "Don't know 🐼",
            "sender_id": username_to_ids["nickleger"],
            "channel_id": c_w_to_ids["general:javascript-devs"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": False,
            "message": "How old are you?",
            "sender_id": username_to_ids["haolam"],
            "channel_id": c_w_to_ids["general:javascript-devs"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": False,
            "message": "Not sure 🐷",
            "sender_id": username_to_ids["nickyli"],
            "channel_id": c_w_to_ids["general:javascript-devs"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": False,
            "message": "Don't know 🐼",
            "sender_id": username_to_ids["nickleger"],
            "channel_id": c_w_to_ids["general:javascript-devs"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": False,
            "message": "Nice to meet you",
            "sender_id": username_to_ids["haolam"],
            "channel_id": c_w_to_ids["general:javascript-devs"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": False,
            "message": "Same",
            "sender_id": username_to_ids["nickyli"],
            "channel_id": c_w_to_ids["general:javascript-devs"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
        {
            "is_private": False,
            "message": "SAME 😀",
            "sender_id": username_to_ids["nickleger"],
            "channel_id": c_w_to_ids["general:javascript-devs"],
            "workspace_id": name_to_ids["javascript-devs"]
        },
    ]

    [db.session.add(Message(**message)) for message in messages]
    db.session.commit()


def undo_messages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM messages"))

    db.session.commit()
