from sqlalchemy.sql import text
from ..models import db, User, Workspace
from ..models.db import environment, SCHEMA


def seed_memberships():
    memberships = [
      {
          "username": "haolam",
          "workspace_name": "aA Union"
      },
      {
          "username": "robin",
          "workspace_name": "aA Union"
      },
      {
          "username": "zoro",
          "workspace_name": "aA Union"
      },
      {
          "username": "sanji",
          "workspace_name": "aA Union"
      },
      {
          "username": "haolam",
          "workspace_name": "hao-nick-nicky"
      },
      {
          "username": "nickleger",
          "workspace_name": "hao-nick-nicky"
      },
      {
          "username": "nickylei",
          "workspace_name": "hao-nick-nicky"
      },
      {
          "username": "haolam",
          "workspace_name": "hao-nick"
      },
      {
          "username": "mihawk",
          "workspace_name": "hao-nicky"
      },
      {
          "username": "haolam",
          "workspace_name": "hao-nicky"
      },
      {
          "username": "haolam",
          "workspace_name": "nick-nicky"
      }
    ]

    for m in memberships:
        user = User.query.filter(User.username == m['username']).one()
        workspace = Workspace.query.filter(Workspace.name == m['workspace_name']).one()
        user.workspaces.append(workspace)
    db.session.commit()


def undo_memberships():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.memberships RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM memberships"))

    db.session.commit()
