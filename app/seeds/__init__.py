from flask.cli import AppGroup
from .users import seed_users, undo_users
from .workspaces import seed_workspaces, undo_workspaces
from .channels import seed_channels, undo_channels
from .memberships import seed_memberships, undo_memberships
from .messages import seed_messages, undo_messages
from .reactions import seed_reactions, undo_reactions
from app.models.db import db, environment, SCHEMA

seed_commands = AppGroup('seed')


@seed_commands.command('all')
def seed():
    if environment == 'production':
        unseed_all_tables()
    seed_all_tables()


@seed_commands.command('undo')
def undo():
    unseed_all_tables()


@seed_commands.command("reset")
def seed_reset():
    unseed_all_tables()
    seed_all_tables()


def seed_all_tables():
  seed_users()
  seed_workspaces()
  seed_channels()
  seed_memberships()
  seed_messages()
  seed_reactions()


def unseed_all_tables():
  undo_reactions()
  undo_messages()
  undo_memberships()
  undo_channels()
  undo_workspaces()
  undo_users()
