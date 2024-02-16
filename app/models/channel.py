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
    created_at = db.Column(db.Date, default=datetime.now)
    updated_at = db.Column(db.Date, default=datetime.now, onupdate=datetime.now)

    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    workspace_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("workspaces.id")), nullable=False)


    """ one-to-many """
    owner = db.relationship("User", back_populates="channels")
    workspace = db.relationship("Workspace", back_populates="channels")
    messages = db.relationship("Message", back_populates="channel", cascade="all, delete-orphan")


    @validates('name')
    def validate_name(self, _, val):
        if len(val) < 4:
            raise ValueError({ "name": "Name must be at least 4 characters long" })
        return val


    @classmethod
    def channel_and_workspace_name_to_ids(cls):
        return { f"{c.name}:{Workspace.query.get(c.workspace_id).name}": c.id for c in cls.query.all() }


    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "owner_id": self.owner_id,
            "workspace_id": self.workspace_id
        }
