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
            "message": "Hey guys, let's start by introducing ourselves...",
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
        {
            "is_private": False,
            "message": "hash maps are fun",
            "sender_id": username_to_ids["haolam"],
            "channel_id": c_w_to_ids["hash maps:DSNA"],
            "workspace_id": name_to_ids["DSNA"]
        },
        {
            "is_private": False,
            "message": "agreed! 😀",
            "sender_id": username_to_ids["nickyli"],
            "channel_id": c_w_to_ids["hash maps:DSNA"],
            "workspace_id": name_to_ids["DSNA"]
        },
        {
            "is_private": False,
            "message": "really? they stress me out",
            "sender_id": username_to_ids["nickleger"],
            "channel_id": c_w_to_ids["hash maps:DSNA"],
            "workspace_id": name_to_ids["DSNA"]
        },
        {
            "is_private": False,
            "message": "someone help me with weighted graphs!",
            "sender_id": username_to_ids["nickleger"],
            "channel_id": c_w_to_ids["weighted graphs:DSNA"],
            "workspace_id": name_to_ids["DSNA"]
        },
        {
            "is_private": False,
            "message": "have you tried polya's framework",
            "sender_id": username_to_ids["nickyli"],
            "channel_id": c_w_to_ids["weighted graphs:DSNA"],
            "workspace_id": name_to_ids["DSNA"]
        },
        {
            "is_private": False,
            "message": "we can't help if you don't ask a good question",
            "sender_id": username_to_ids["haolam"],
            "channel_id": c_w_to_ids["weighted graphs:DSNA"],
            "workspace_id": name_to_ids["DSNA"]
        },
        {
            "is_private": False,
            "message": "we can't help if you don't ask a good question",
            "sender_id": username_to_ids["haolam"],
            "channel_id": c_w_to_ids["weighted graphs:DSNA"],
            "workspace_id": name_to_ids["DSNA"]
        },
        {
            "is_private": False,
            "message": "linked lists should always be doubly linked",
            "sender_id": username_to_ids["haolam"],
            "channel_id": c_w_to_ids["basic linked lists:DSNA"],
            "workspace_id": name_to_ids["DSNA"]
        },
        {
            "is_private": False,
            "message": "they should always have a tail pointer too! 😀",
            "sender_id": username_to_ids["nickyli"],
            "channel_id": c_w_to_ids["basic linked lists:DSNA"],
            "workspace_id": name_to_ids["DSNA"]
        },
        {
            "is_private": False,
            "message": "i'll just use an array. 0(n) search is fine for my app",
            "sender_id": username_to_ids["nickleger"],
            "channel_id": c_w_to_ids["basic linked lists:DSNA"],
            "workspace_id": name_to_ids["DSNA"]
        },
        {
            "is_private": False,
            "message": "weather is nice today 😀",
            "sender_id": username_to_ids["nickyli"],
            "channel_id": c_w_to_ids["general:aA Union"],
            "workspace_id": name_to_ids["aA Union"]
        },
        {
            "is_private": False,
            "message": "so sunny!",
            "sender_id": username_to_ids["nickleger"],
            "channel_id": c_w_to_ids["general:aA Union"],
            "workspace_id": name_to_ids["aA Union"]
        },
        {
            "is_private": False,
            "message": "so warm!",
            "sender_id": username_to_ids["haolam"],
            "channel_id": c_w_to_ids["general:aA Union"],
            "workspace_id": name_to_ids["aA Union"]
        },
        {
            "is_private": False,
            "message": "no homework in project week??",
            "sender_id": username_to_ids["haolam"],
            "channel_id": c_w_to_ids["homework discussion:aA Union"],
            "workspace_id": name_to_ids["aA Union"]
        },
        {
            "is_private": False,
            "message": "nope. just stress lol",
            "sender_id": username_to_ids["nickleger"],
            "channel_id": c_w_to_ids["homework discussion:aA Union"],
            "workspace_id": name_to_ids["aA Union"]
        },
        {
            "is_private": False,
            "message": "yay no homework",
            "sender_id": username_to_ids["nickyli"],
            "channel_id": c_w_to_ids["homework discussion:aA Union"],
            "workspace_id": name_to_ids["aA Union"]
        },
        {
            "is_private": False,
            "message": "we all passed, yay!",
            "sender_id": username_to_ids["nickyli"],
            "channel_id": c_w_to_ids["assessments:aA Union"],
            "workspace_id": name_to_ids["aA Union"]
        },
        {
            "is_private": True,
            "message": "hi hao!",
            "sender_id": username_to_ids["nickyli"],
            "receiver_id": username_to_ids["haolam"],
            "workspace_id": name_to_ids["aA Union"]
        },
        {
            "is_private": True,
            "message": "hi nicky!",
            "receiver_id": username_to_ids["nickyli"],
            "sender_id": username_to_ids["haolam"],
            "workspace_id": name_to_ids["aA Union"]
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
