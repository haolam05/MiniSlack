from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod


class Message(db.Model):
    __tablename__ = "messages"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    is_private = db.Column(db.Boolean, nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    sender_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    channel_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("channels.id")))
    workspace_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("workspaces.id")))


    """ one-to-many """
    owner = db.relationship("User", back_populates="messages", foreign_keys=[sender_id])
    reactions = db.relationship("Reaction", back_populates="message", cascade="all, delete-orphan")
    channel = db.relationship("Channel", back_populates="messages")
    workspace = db.relationship("Workspace", back_populates="messages")


    @classmethod
    def validate(cls, data):
        if "message" not in data or len(data["message"]) <= 0:
            return { "message": "Message is required" }, 400
        if "workspace_id" not in data:
            return { "message": "Workspace Id is required" }, 400
        if "is_private" not in data:
            return { "message": "Private status is required" }, 400
        if data["is_private"] == True and data["receiver_id"] == None:
            return { "message": "Missing receiver ID" }, 400
        if data["is_private"] == False and data["channel_id"] == None:
            return { "message": "Missing channel ID" }, 400
        return True


    def to_dict(self, reactions=False):
        result = {
            "id": self.id,
            "is_private": self.is_private,
            "message": self.message,
            "sender_id": self.sender_id,
            "receiver_id": self.receiver_id,
            "channel_id": self.channel_id,
            "workspace_id": self.workspace_id,
            "created_at": str(self.created_at)
        }

        if reactions:
            result["reactions"] = []
            for reaction in self.reactions:
                result["reactions"].append(reaction.to_dict(owner=True))

        return result
