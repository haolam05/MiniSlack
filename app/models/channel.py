from datetime import datetime
from sqlalchemy.orm import validates
from .db import db, environment, SCHEMA, add_prefix_for_prod
from .workspace import Workspace


class Channel(db.Model):
    __tablename__ = "channels"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    topic = db.Column(db.String)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    workspace_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("workspaces.id")), nullable=False)


    """ one-to-many """
    owner = db.relationship("User", back_populates="channels")
    workspace = db.relationship("Workspace", back_populates="channels")
    messages = db.relationship("Message", back_populates="channel", cascade="all, delete-orphan")


    @classmethod
    def validate(cls, data, workspace_id, new_name=True):
        if "name" not in data:
            return { "name": "Name is required" }, 400
        if len(data["name"]) < 4:
            return { "name": "Name must be at least 4 characters long" }, 400
        if new_name:
            channel = cls.query.filter(cls.name == data["name"]).first()
            if channel and channel.workspace_id == workspace_id:
                return { "name": "This name is already taken" }, 500
        return True


    @classmethod
    def channel_and_workspace_name_to_ids(cls):
        return { f"{c.name}:{Workspace.query.get(c.workspace_id).name}": c.id for c in cls.query.all() }


    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "topic": self.topic,
            "description": self.description,
            "owner_id": self.owner_id,
            "workspace_id": self.workspace_id,
            "created_at": str(self.created_at)
        }
