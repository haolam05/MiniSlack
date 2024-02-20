from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
from ..models import db, User


def seed_users():
    location = 'https://slack2024.s3.us-west-2.amazonaws.com/public/'

    users = [
        {
            "first_name": "Hao",
            "last_name": "Lam",
            "username": "haolam",
            "password": "password",
            "email": "haolam@user.io",
            "profile_image_url": location + "avatar1.png"
        },
        {
            "first_name": "Nicky",
            "last_name": "Li",
            "username": "nickyli",
            "password": "password2",
            "email": "nickyli@user.io",
            "profile_image_url": location + "avatar2.png"
        },
        {
            "first_name": "Nick",
            "last_name": "Leger",
            "username": "nickleger",
            "password": "password3",
            "email": "nickleger@user.io",
            "profile_image_url": location + "avatar3.png"
        },
        {
            "first_name": "Luffy",
            "last_name": "Monkey D.",
            "username": "luffy",
            "password": "password4",
            "email": "luffy@user.io",
            "profile_image_url": location + "avatar4.png"
        },
        {
            "first_name": "Zoro",
            "last_name": "Roronoa",
            "username": "zoro",
            "password": "password5",
            "email": "zoro@user.io",
            "profile_image_url": location + "avatar5.png"
        },
        {
            "first_name": "Sanji",
            "last_name": "Vinsmoke",
            "username": "sanji",
            "password": "password6",
            "email": "sanji@user.io",
            "profile_image_url": location + "avatar6.png"
        },
                {
            "first_name": "Robin",
            "last_name": "Nico",
            "username": "robin",
            "password": "password7",
            "email": "robin@user.io",
            "profile_image_url": location + "avatar7.png"
        },
        {
            "first_name": "Mihawk",
            "last_name": "Dracule",
            "username": "mihawk",
            "password": "password8",
            "email": "mihawk@user.io",
            "profile_image_url": location + "avatar8.png"
        },
        {
            "first_name": "Ace",
            "last_name": "Portgas D.",
            "username": "acee",
            "password": "password9",
            "email": "ace@user.io",
            "profile_image_url": location + "avatar9.png"
        }
    ]

    [db.session.add(User(**user)) for user in users]
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
