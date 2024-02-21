from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod


memberships = db.Table(
  "memberships",
  db.Model.metadata,
  db.Column('user_id', db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), primary_key=True),
  db.Column('workspace_id', db.Integer, db.ForeignKey(add_prefix_for_prod("workspaces.id")), primary_key=True),
  db.Column('created_at', db.DateTime, default=datetime.now),
  db.Column('updated_at', db.DateTime, default=datetime.now, onupdate=datetime.now)
)

if environment == "production":
    memberships.schema = SCHEMA
