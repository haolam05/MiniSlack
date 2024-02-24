from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod


class Workspace(db.Model):
    __tablename__ = "workspaces"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)


    """ one-to-many """
    owner = db.relationship("User", back_populates="user_workspaces")
    channels = db.relationship("Channel", back_populates="workspace", cascade="all, delete-orphan")
    messages = db.relationship("Message", back_populates="workspace", cascade="all, delete-orphan")

    """ many-to-many """
    users = db.relationship('User', secondary="memberships", back_populates="workspaces")


    @classmethod
    def name_to_ids(cls):
        return { workspace.name: workspace.id for workspace in cls.query.all() }


    @classmethod
    def validate(cls, data):
        if "name" not in data:
            return { "name": "Name is required" }, 400
        if len(data["name"]) < 4:
            return { "name": "Name must be at least 4 characters" }, 400
        if cls.query.filter(cls.name == data["name"]).one_or_none():
            return { "name": "This name is already taken" }, 500
        return True


    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "owner_id": self.owner_id,
            "created_at": str(self.created_at)
        }


    def to_dict_details(self):
        return {
            "id": self.id,
            "name": self.name,
            "owner_id": self.owner_id,
            "created_at": str(self.created_at),
            "updated_at": str(self.updated_at)
        }
