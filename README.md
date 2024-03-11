# MiniSlack

## https://minislack.onrender.com

## Database Schema Design

![slack-database-schema]

[slack-database-schema]: https://slack2024.s3.us-west-2.amazonaws.com/public/slack-database-schema.png

# Demo
## Sign up
![alt text](<demo/signup.gif>)

## Login
![alt text](<demo/login.gif>)

## Demo user login
![alt text](<demo/demo-user-login.gif>)

## Logout
![alt text](<demo/logout.gif>)

## View workspaces
![alt text](<demo/view-workspaces.gif>)

## Create workspace
![alt text](<demo/create-workspace.gif>)

## Update workspace
![alt text](<demo/Update-workspace.gif>)

## Delete workspace
![alt text](<demo/Delete-workspace.gif>)

## View channels
![alt text](<demo/View-channels.gif>)

## Create channel
![alt text](<demo/Create-channel.gif>)

## Edit channel
![alt text](<demo/Edit-channel.gif>)

## Delete channel
![alt text](<demo/Delete-channel.gif>)

## View messages
![alt text](<demo/View-messages.gif>)

## Create message
![alt text](<demo/Create-message.gif>)

## Edit message
![alt text](<demo/Edit-message.gif>)

## Delete message
![alt text](<demo/Delete-message.gif>)

## View reactions
![alt text](<demo/View-reactions.gif>)

## Creat reaction
![alt text](<demo/Create-reaction.gif>)

## Delete reaction
![alt text](<demo/Delete-reaction.gif>)

## Techologies
* PPFR Stack
  * Postgres (Sqlite in development)
  * Python
  * Flask
  * React (Redux for state management)
* SQLAlchemy
  * ORM for easier CRUD operations on the database
* AWS
  * Cloud hosting service for image(s) uploading & downloading
* Boto3 & Botocore
  * Used to create, configure, and manage AWS services
* Dyanmic seedings
  * A variety of seeds are dynamically created for testing and demo purposes without hard-coding
* Flask-socketio
  * Allows for real-time notifications, messaging, and authorization changes (e.g. being added to or removed from a workspace)
* Redux State Hydration
  * Avoid unecessary fetches from the database, speed up application, and increase users' experience while ensuring data integrity across pages
* CSRF Protection
  * By exchanging tokens for non-GET requests
* Prevent SQL injections
  * By sanitize queries input
* Prevent Rainbow Table attacks
  * By salt and hash passwords before storing in the database
  * Prevent XSS attacks
  * Force all inputs to be text
  * Also applied csrf practice mentioned above for extra layer of protection
* CORS
  * Enabled during development
* Eslint
  * Used for consistent styling
* DBDiagram
  * Used for design and sketch database schema, assign associations amongst tables
* Data Racing
  * Avoid false positive due to fast button clicks
  * Avoid multiple CUD records being sent to the database by ensuring CUD signals are only processed once

## Features
   * See user_stories.md

## API Documentation

## USER AUTHENTICATION/AUTHORIZATION

### All endpoints that require authentication

All endpoints that require a current user to be logged in.

* Request: endpoints that require authentication
* Error Response: Require authentication
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Unauthorized"
    }
    ```

### All endpoints that require proper authorization

All endpoints that require authentication and the current user does not have the
correct role(s) or permission(s).

* Request: endpoints that require proper authorization
* Error Response: Require proper authorization
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Forbidden"
    }
    ```

### Get the Current User

Returns the information about the current user that is logged in.

* Require Authentication: false
* Request
  * Method: GET
  * URL: /api/auth
  * Body: none

* Successful Response when there is a logged in user
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Smith",
        "email": "john1.smith@gmail.com",
        "username": "JohnSmith,",
        "profile_image_url": null,
        "is_deleted": false
      }
    }
    ```

* Successful Response when there is no logged in user
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": null
    }
    ```
### Get a User by ID

Returns information about a user.

* Require Authentication: True
* Request
  * Method: GET
  * URL: /api/auth/:id
  * Body: none

* Successful Response when there is a logged in user
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "email": "zoro@user.io",
      "first_name": "Zoro",
      "id": 5,
      "is_deleted": false,
      "last_name": "Roronoa",
      "profile_image_url": "https://slack2024.s3.us-west-2.amazonaws.com/public/avatar5.png",
      "username": "zoro"
    }
    ```

* Successful Response when there is no logged in user
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": null
    }
    ```

### Log In a User

Logs in a user with valid credentials and returns the current user's
information.

* Require Authentication: false
* Request
  * Method: POST
  * URL: /api/auth/login
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "email": "john1.smith@gmail.com",
      "password": "secret_password"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Smith",
        "email": "john1.smith@gmail.com",
        "username": "JohnSmith,",
        "profile_image_url": null,
        "is_deleted": false
      }
    }
    ```
* Error response: Bad request
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "email": [
          "Email provided not found."
      ]
    }

    or

    {
      "password": [
        "Password was incorrect."
      ]
    }
    ```
### Log Out a User

Logs out the current user, ending their session.

* Require Authentication: True
* Request
  * Method: GET
  * URL: /api/auth/logout
  * Headers:
    * Content-Type: application/json
  * Body: None

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "User logged out"
    }
    ```


### Sign Up a User

Creates a new user, logs them in as the current user, and returns the current user's information.

* Require Authentication: false
* Request
  * Method: POST
  * URL: /api/auth/signup
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "first_name": "John",
      "last_name": "Smith",
      "email": "john1.smith@gmail.com",
      "username": "JohnSmith",
      "password": "secret_password",
      "profile_image_url": "https://meetup2024.s3.us-west-2.amazonaws.com/public/avatar2.png"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Smith",
        "email": "john1.smith@gmail.com",
        "username": "JohnSmith,",
        "profile_image_url": "https://meetup2024.s3.us-west-2.amazonaws.com/public/avatar2.png",
        "is_deleted": false
      }
    }
    ```

* Error response: User already exists with the specified email or username
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "email": [
          "Email address is already in use."
      ],
      "username": [
          "Username is already in use."
      ]
    }
    ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "email": [
          "Email is invalid."
      ],
      "first_name": [
          "This field is required."
      ],
      "last_name": [
          "This field is required."
      ],
      "password": [
          "Password must be at least 6 characters."
      ],
      "username": [
          "Username must be at least 4 characters."
      ],
      "profile_image_url": [
        "Photo must be a valid image URL!"
      ],
    }
    ```

### Update a User

Update an existing user. (Only first name and last name can be updated)

* Require Authentication: true
* Require Authorization: True. (Current user data can only be updated by the current user)
* Request
  * Method: POST
  * URL: /api/auth/udpate
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "email": "haolam@user.io",
      "first_name": "Updated First Name",
      "last_name": "Updated Last Name",
      "profile_image_url": "https://slack2024.s3.us-west-2.amazonaws.com/public/avatar1.png",
      "username": "haolam",
      "password": "password"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "email": "haolam@user.io",
      "first_name": "Updated First Name",
      "id": 1,
      "is_deleted": false,
      "last_name": "Updated Last Name",
      "profile_image_url": "https://slack2024.s3.us-west-2.amazonaws.com/public/avatar1.png",
      "username": "haolam"
    }
    ```
* Error response: Validation error - first name and last name required
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "first_name": [
          "This field is required."
      ],
      "last_name": [
          "This field is required."
      ]
    }
    ```
* Error response: Bad request
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "password": [
        "Password was incorrect."
      ]
    }
    ```
### Update a User's password

Update a user's password

* Require Authentication: True
* Require Authorization: True. (Current user data can only be updated by the current user)
* Request
  * Method: POST
  * URL: /api/auth/password
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "password": "old_password",
      "new_password": "new_password"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Successfully updated your password. Please log in again."
    }
    ```
* Error response: Validation error - password length
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "new_password": [
          "Password must be at least 6 characters."
      ]
    }
    ```
* Error response: Bad request
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "password": [
        "Password was incorrect."
      ]
    }
    ```
### Delete a User

Delete a user profile.

* Require Authentication: True
* Require Authorization: True. (Only the current user can delete their account)
* Request
  * Method: DELETE
  * URL: /api/auth/delete
  * Headers:
    * Content-Type: application/json
  * Body: None

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Successfully deleted account"
    }
    ```


## WORKSPACES
### Get all workspaces joined or owned by the current signed in user

* Require Authentication: True
* Require Authorization: True. (This route returns only the current user's workspaces)
* Request
  * Method: GET
  * URL: /api/workspaces/
  * Headers: None
  * Body: None

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "JoinedWorkspaces": [
        {
        "id": 1,
        "name": "to-do",
        "owner_id": "2",
        }
      ],
      "OwnedWorkspaces": [
        {
        "id": 3,
        "name": "lecture-questions",
        "owner_id": 1
        }
      ]
    }
    ```
### Get workspace by id

* Require Authentication: True
* Require Authorization: True. (Must be the workspace owner or a member of the workspace)
* Request
  * Method: GET
  * URL: /api/workspaces/:id
  * Headers: None
  * Body: None

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
      {
        "id": 3,
        "name": "lecture-questions",
        "owner_id": 1,
        "Owner": {
          "id": 1,
          "first_name": "Hao",
          "last_name": "Lam",
          "username": "haolam",
          "email": "haolam@user.io",
          "profile_image_url": "image.amazon.url",
          "is_deleted": false
        },
        "Members": [
          {
          "id": 2,
          "first_name": "Nicky",
          "last_name": "Li",
          "username": "nickyli",
          "email": "nickyli@user.io",
          "profile_image_url": "image.amazon.url",
          "is_deleted": false
          }
        ],
        "Channels": [
          {
            "id": 1,
            "name": "general",
            "topic": "anything",
            "description": "anything and everything",
            "owner_id": 1,
            "workspace_id": 1
          }
        ]
      }
    ```

* Error response: Workspace not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
   ```json
    {
      "message": "Workspace couldn't be found"
    }
    ```

### Create a new workspace

Creates a new workspace.

* Require Authentication: true
* Request
  * Method: POST
  * URL: /api/workspaces/
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "name": "new-workspace"
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
      {
        "id": 1,
        "name": "new-workspace",
        "owner_id": 2
      }
    ```

* Error response: Validation error - name required
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    { "name": "This field is required" }
    ```
* Error response: Validation error - name length too short
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    { "name": "Name must be at least 4 characters" }
    ```
* Error response: Validation error - name already exists
  * Status Code: 500
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    { "name": "This name is already taken" }
    ```
### Update a workspace by id

Update an existing workspace.

* Require Authentication: True
* Require Authorization: True. (Must be the workspace owner)
* Request
  * Method: POST
  * URL: /api/workspaces/
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "name": "new-workspace"
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
      {
        "id": 1,
        "name": "new-workspace",
        "owner_id": 2
      }
    ```

* Error response: Validation error - name required
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    { "name": "This field is required" }
    ```
* Error response: Validation error - name length too short
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    { "name": "Name must be at least 4 characters" }
    ```
* Error response: Validation error - name already exists
  * Status Code: 500
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    { "name": "This name is already taken" }
    ```

* Error response: Workspace not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
   ```json
    {
      "message": "Workspace couldn't be found"
    }
    ```

### Delete a workspace by id

Delete an existing workspace by id.

* Require Authentication: True
* Require Authorization: True. (Must be the workspace owner)
* Request
  * Method: DELETE
  * URL: /api/workspaces/:id
  * Body: None

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Successfully deleted <workspaceName> workspace"
    }
    ```

* Error response: Workspace not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
   ```json
    {
      "message": "Workspace couldn't be found"
    }
    ```

### Get all channels by workspace id

Returns all channels that belong to a workspace specifed by id.

* Require Authentication: True
* Require Authorization: True (Must be the owner or a member of the workspace)
* Request
  * Method: GET
  * URL: /api/workspaces/:workspaceId/channels
  * Body: None

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
      {
        "Channels": [
            {
                "description": null,
                "id": 1,
                "name": "general",
                "owner_id": 1,
                "topic": null,
                "workspace_id": 1
            }
        ]
      }
    ```
* Error response: Workspace not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
   ```json
    {
      "message": "Workspace couldn't be found"
    }
    ```

### Create a new channel by workspace id

Create a new channel for a workspace

* Require Authentication: True
* Require Authorization: True. (Must be the owner or a member of the workspace)
* Request
  * Method: POST
  * URL: /api/workspaces/:workspaceId/channels
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "name": "my-xi",
      "topic": "numbers",
      "description": "This is a description"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
      {
        "description": "This is a description",
        "id": 10,
        "name": "my-ni",
        "owner_id": 4,
        "topic": "numbers",
        "workspace_id": 6
      }
    ```
* Error response: Workspace not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
   ```json
    {
      "message": "Workspace couldn't be found"
    }
    ```
* Error response: Validation error - name already exists
  * Status Code: 500
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    { "name": "This name is already taken" }
    ```
* Error response: Bad request
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "name": [
        "This field is required."
      ]
    }
    or
    {
      "name": [
        "Name must be at least 4 characters"
      ]
    }
    ```

### Create a new membership by workspace id

Create a new membership for a workspace.

* Require Authentication: True
* Require Authorization: True. (Only workspace's owner can invite others to a workspace)
* Request
  * Method: POST
  * URL: /api/workspaces/:workspaceId/memberships
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "email": "zoro@user.io"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
      {
        "user_id": 1,
        "workspace_id": 6
      }
    ```
* Error response: Workspace not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
   ```json
    {
      "message": "Workspace couldn't be found"
    }
    ```

* Error response: bad request - email not found
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "email": [
        "Email provided not found."
      ]
    }
    ```

### Get all members by workspace id

Returns all members that belonged to a workspace specifed by id

* Require Authentication: True
* Require Authorization: True. (Must be the owner or member of the workspace)
* Request
  * Method: GET
  * URL: /api/workspaces/:workspaceId/memberships
  * Headers: None
  * Body: None

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Members": [
        {
            "email": "haolam@user.io",
            "first_name": "Hao",
            "id": 1,
            "is_deleted": false,
            "last_name": "Lam",
            "profile_image_url": null,
            "username": "haolam"
        }
      ]
    }
    ```
* Error response: Workspace not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
   ```json
    {
      "message": "Workspace couldn't be found"
    }
    ```

### Delete a member of a Workspace

Delete a member of a workspace.

* Require Authentication: True
* Require Authorization: True. (Must be the owner of the workspace. A member of the workspace can leave, which is essentially the same)
* Request
  * Method: DELETE
  * URL: /api/workspaces/:workspaceId/memberships/:userId
  * Body: None

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Successfully removed haolam@user.io from team building workspace"
    }
    ```

* Error response: Workspace not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
   ```json
    {
      "message": "Workspace couldn't be found"
    }
    ```
* Error response: User not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
   ```json
    {
      "message": "User couldn't be found"
    }
    ```
* Error response: Validation error - not a member
  * Status Code: 500
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    { "name": "The user is not a member of this workspace" }
    ```

### Get all messages for a channel by channel id

* Require Authentication: True
* Require Authorization: True. (Must be the owner or member of the workspace)
* Request
  * Method: GET
  * URL: /api/channels/:id/messages
  * Headers: None
  * Body: None

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Messages": [
        {
            "channel_id": 4,
            "id": 4,
            "is_private": false,
            "message": "Hey guys, let's start by introduce ourselves...",
            "receiver_id": null,
            "sender_id": 1,
            "workspace_id": 2
        },
        {
            "channel_id": 4,
            "id": 5,
            "is_private": false,
            "message": "My name is Nicky.",
            "receiver_id": null,
            "sender_id": 2,
            "workspace_id": 2
        },
        {
            "channel_id": 4,
            "id": 6,
            "is_private": false,
            "message": "I'm Nick",
            "receiver_id": null,
            "sender_id": 3,
            "workspace_id": 2
        }
    ]
    }
    ```
  * Error response: User not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
   ```json
    {
      "message": "Channel couldn't be found"
    }
    ```

### Create a message
Create a Message

* Require Authentication: True
* Require Authorization: True. (Author must be the owner or member of the workspace)
* Request
  * Method: POST
  * URL: /api/messages/
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Saying hi from private messages...",
      "is_private": true,
      "receiver_id": 4,
      "workspace_id": 1
    }

    or

    {
      "message": "Channel message lollll...",
      "channel_id": 3,
      "is_private": false,
      "workspace_id": 1
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "channel_id": null,
      "id": 7,
      "is_private": true,
      "message": "Saying hi from private messages...",
      "receiver_id": 4,
      "sender_id": 1,
      "workspace_id": 1
    }
    or
    {
      "channel_id": 3,
      "id": 10,
      "is_private": false,
      "message": "Channel message lollll...",
      "receiver_id": null,
      "sender_id": 1,
      "workspace_id": 1
    }
    ```
* Error response: Validation error - missing message or workspace id
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
    "message": [
        "This field is required."
    ],
    "workspace_id": [
        "This field is required."
    ]
    }
    ```
* Error response: Workspace not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
   ```json
    {
      "message": "Workspace couldn't be found"
    }
    ```
* Error response (channel message): Channel not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
   ```json
    {
      "message": "Channel couldn't be found"
    }
    ```
* Error response (private message): Receiver not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
   ```json
    {
      "message": "Receiver does not exist"
    }
    ```

### Update a message by id

Update an existing message.

* Require Authentication: True
* Require Authorization: True. (Must be the author of the message)
* Request
  * Method: PUT
  * URL: /api/messages/:id
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Saying HELLO from private messages...",
      "is_private": true,
      "receiver_id": 5,
      "workspace_id": 1
    }
    or
    {
      "message": "Saying hi from channel messages...",
      "channel_id": 6,
      "is_private": false,
      "workspace_id": 1
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "channel_id": null,
      "id": 1,
      "is_private": true,
      "message": "Saying UPDATE from private messages...",
      "receiver_id": 3,
      "sender_id": 1,
      "workspace_id": 2
    }

    or

    {
      "channel_id": 4,
      "id": 4,
      "is_private": false,
      "message": "CHANNEL UPDATE!!",
      "receiver_id": null,
      "sender_id": 1,
      "workspace_id": 2
    }
    ```

* Error response: Message not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
   ```json
    {
      "message": "Message couldn't be found"
    }
    ```

* Error response: Validation error - missing message or workspace id
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
    "message": [
        "This field is required."
    ],
    "workspace_id": [
        "This field is required."
    ]
    }
    ```

### Delete a Message

Delete a message

* Require Authentication: True
* Require Authorization: True (Must be the author of the message)
* Request
  * Method: DELETE
  * URL: /api/messages/:messageId
  * Body: None

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Succesfully deleted <current user's email> message."
    }
    ```

* Error response: Message not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
   ```json
    {
      "message": "Message couldn't be found"
    }
    ```

### Get all direct messages of the current user

* Require Authentication: True
* Require Authorization: True. (A user can only see their own direct messages)
* Request
  * Method: GET
  * URL: /api/auth/messages
  * Headers: None
  * Body: None

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
      {
        "Messages": [
            {
                "channel_id": null,
                "id": 2,
                "is_private": true,
                "message": "Nice to meet you 😀",
                "receiver_id": 3,
                "sender_id": 1,
                "workspace_id": 2
            },
            {
                "channel_id": null,
                "id": 7,
                "is_private": true,
                "message": "Saying hi from private messages...",
                "receiver_id": 4,
                "sender_id": 1,
                "workspace_id": 1
            },
            {
                "channel_id": null,
                "id": 9,
                "is_private": true,
                "message": "Saying hi from private messages...",
                "receiver_id": 1,
                "sender_id": 1,
                "workspace_id": 1
            }
        ]
      }
    ```
### Get all reactions of a message specified by id

* Require Authentication: True
* Request
  * Method: GET
  * URL: /messages/:messageID/reactions
  * Headers: None
  * Body: None

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Reactions": [
          {
              "created_at": "Mon, 19 Feb 2024 00:00:00 GMT",
              "encoded_text": "😂",
              "id": 1,
              "message_id": 3,
              "user_id": 1
          }
      ]
    }
    ```
* Error response: Message not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
   ```json
    {
      "message": "Message couldn't be found"
    }
    ```

### Create a new reaction for a message specified by id
* Require Authentication: True
* Require Authorization: True (Must be the owner or a member of a workspace to add a reaction to a channel message. Must be sender or receiver of a private message to add a reaction)
* Request
  * Method: POST
  * URL: /messages/:messageID/reactions
  * Headers: None
  * Body:
  ```json
    {
    "encoded_text": "🐼🐼"
    }
  ```
* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
    "created_at": "Mon, 19 Feb 2024 00:00:00 GMT",
    "encoded_text": "🐼🐼",
    "id": 4,
    "message_id": 3,
    "user_id": 1
    }
    ```
* Error response: Message not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
   ```json
    {
      "message": "Message couldn't be found"
    }
    ```
### Delete a reaction for a message specified by id
* Require Authentication: True
* Require Authorization: True (Must be the author of the reaction)
* Request
  * Method: DELETE
  * URL: /messages/:messageID/reactions/:reactionID
  * Headers: None
  * Body: None
* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Successfully deleted reaction"
    }
    ```
* Error response: Message not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
   ```json
    {
      "message": "Message couldn't be found"
    }
    ```
* Error response: Reaction not found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
   ```json
    {
      "message": "Reaction couldn't be found"
    }
    ```
