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


onlines = {}

@socketio.on("enter_workspace")
def handle_new_message(data):
    workspace_id = data["workspace_id"]
    user_id = data["user_id"]

    if workspace_id not in onlines:
        onlines[workspace_id] = [user_id]
    else:
        onlines[workspace_id].append(user_id)

    emit("enter_workspace", onlines[workspace_id], broadcast=True)


@socketio.on("leave_workspace")
def handle_new_message(data):
    workspace_id = data["workspace_id"]
    user_id = data["user_id"]

    if workspace_id in onlines and user_id in onlines[workspace_id]:
        onlines[workspace_id].remove(user_id)

    emit("enter_workspace", onlines[workspace_id], broadcast=True)
