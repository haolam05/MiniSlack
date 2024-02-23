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
            "username": "nickyli",
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
            "workspace_name": "javascript-devs"
        },
        {
            "username": "nickleger",
            "workspace_name": "javascript-devs"
        },
        {
            "username": "nickyli",
            "workspace_name": "javascript-devs"
        },
        {
            "username": "haolam",
            "workspace_name": "css champs"
        },
        {
            "username": "nickyli",
            "workspace_name": "DSNA"
        },
        {
            "username": "haolam",
            "workspace_name": "DSNA"
        },
        {
            "username": "haolam",
            "workspace_name": "team building"
        },
        {
            "username": "nickyli",
            "workspace_name": "python-devs"
        },
        {
            "username": "haolam",
            "workspace_name": "python-devs"
        },
        {
            "username": "nickleger",
            "workspace_name": "python-devs"
        },
        {
            "username": "robin",
            "workspace_name": "python-devs"
        },
        {
            "username": "nickleger",
            "workspace_name": "DSNA"
        },
        {
            "username": "nickleger",
            "workspace_name": "team building"
        },
        {
            "username": "nickyli",
            "workspace_name": "team building"
        },
        {
            "username": "nickyli",
            "workspace_name": "css champs"
        },
        {
            "username": "nickleger",
            "workspace_name": "css champs"
        },
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
