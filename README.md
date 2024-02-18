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
      "id": 1,
      "first_name": "John",
      "last_name": "Smith",
      "email": "john1.smith@gmail.com",
      "username": "JohnSmith,",
      "profile_image_url": null,
      "is_deleted": false
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
      "id": 1,
      "first_name": "John",
      "last_name": "Smith",
      "email": "john1.smith@gmail.com",
      "username": "JohnSmith,",
      "profile_image_url": null,
      "is_deleted": false
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
      "id": 10,
      "first_name": "John",
      "last_name": "Smith",
      "email": "john1.smith@gmail.com",
      "username": "JohnSmith",
      "is_deleted": false,
      "profile_image_url": "https://meetup2024.s3.us-west-2.amazonaws.com/public/avatar2.png"
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
  * URL: /api/workspace/
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
        },
        {
        "id": 2,
        "name": "backend-tasks",
        "owner_id": "3",
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
* Request
  * Method: GET
  * URL: /api/workspace/:id
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
          },
          {
          "id": 3,
          "first_name": "Nick",
          "last_name": "Leger",
          "username": "nickleger",
          "email": "nickleger@user.io",
          "profile_image_url": "image.amazon.url",
          "is_deleted": false
          },
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
          {
            "id": 2,
            "name": "homework discussion",
            "topic": "homework",
            "description": "homework q & a",
            "owner_id": 1,
            "workspace_id": 1
          }
          {
            "id": 3,
            "name": "assessments",
            "topic": null,
            "description": null,
            "owner_id": 2,
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

Creates a workspace and redirects to workspace's page.

* Require Authentication: true
* Request
  * Method: POST
  * URL: /api/workspace/
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "name": "new-workspace",
      "owner_id": "2"
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
    { "name": "Name is required" }
    ```
* Error response: Validation error - name length too short
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    { "name": "Name must be at least 4 characters long" }
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

Creates a workspace and redirects to workspace's page.

* Require Authentication: true
* Require Authorization: true
* Request
  * Method: POST
  * URL: /api/workspace/
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "name": "new-workspace",
      "owner_id": "2"
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
    { "name": "Name is required" }
    ```
* Error response: Validation error - name length too short
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    { "name": "Name must be at least 4 characters long" }
    ```
* Error response: Validation error - name already exists
  * Status Code: 500
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    { "name": "This name is already taken" }
    ```
