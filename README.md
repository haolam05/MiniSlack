# MiniSlack

## https://minislack.onrender.com

## Database Schema Design

![slack-database-schema]

[slack-database-schema]: https://slack2024.s3.us-west-2.amazonaws.com/public/slack-database-schema.png

## Demo

## Techologies

## Design Principles and Techniques

## Features

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

### Log In a User

Logs in a current user with valid credentials and returns the current user's
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

Logs out current user.

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

## WORKSPACES
### Get all workspaces joined or owned by the current signed in user

* Require Authentication: true
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

* Require Authentication: true
* Require Authorization: true
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
          "last_name": "Lei",
          "username": "nickylei",
          "email": "nickylei@user.io",
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

* Require Authentication: true
* Require Authorization: true
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

* Require Authentication: true
* Require Authorization: true
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

Returns all channelrs that belonged to a workspace specifed by id. Only owner and members of workspace can see.

* Require Authentication: true
* Require Authorization: true
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

Create a new channel for a workspace. Any workspace's member can create a channel.

* Require Authentication: true
* Require Authorization: true
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

Create a new membership for a workspace. Only workspace's owner can invite others.

* Require Authentication: true
* Require Authorization: true
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

* Require Authentication: true
* Require Authorization: true
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

### Delete a membership from a Workspace

Delete a membership for a workspace. Only workspace's owner can remove member. User can leaves the workspace..

* Require Authentication: true
* Require Authorization: true
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
      "message": "Successfully removed haolam@user.io from nick-nicky workspace"
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

* Require Authentication: true
* Require Authorization: true
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

Create a Message

* Require Authentication: true
* Require Authorization: true
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

* Require Authentication: true
* Require Authorization: true
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
  * Status Code: 201
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
  
