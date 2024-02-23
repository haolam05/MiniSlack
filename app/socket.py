import os
from flask_socketio import SocketIO, emit


if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "http://minislack.onrender.com",
        "https://minislack.onrender.com"
    ]
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins=origins)


# @socketio.on("new_message")
# def handle_new_message(data):
#     print('🐷backend', "new_message",data)
#     emit("new_message", data, broadcast=True)
