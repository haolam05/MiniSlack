from datetime import datetime
from sqlalchemy.orm import validates
from .db import db, environment, SCHEMA, add_prefix_for_prod


class Reaction(db.Model):
    __tablename__="reactions"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    encoded_text = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)

    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    message_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("messages.id")), nullable=False)


    """ one-to-many """
    message = db.relationship("Message", back_populates="reactions")
    user = db.relationship("User", back_populates="reactions")


    @classmethod
    def validate(cls, data):
        if "encoded_text" not in data:
            return { "message": "Reaction icon is required" }, 400
        return True


    def to_dict(self):
        return {
            "id": self.id,
            "encoded_text": self.encoded_text,
            "created_at": self.created_at,
            "user_id": self.user_id,
            "message_id": self.message_id
        }
