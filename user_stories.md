# MiNiSlack User Stories

## Users

### Sign Up

* Unregistered and unauthorized users are able to sign up for the website via a sign-up form.
  * A user accesses the sign-up form by clicking the profile button on the left side of the page, then clicking the sign up button, at which point a modal appears:
    * A user is able to enter their first name, last name, email, username, password, and profile image (optional) on a clearly laid out form.
    * A user will be logged in upon successfully completing the sign-up form
    * The sign-up form's submit button is disabled if the user hasn't entered data for a required field.
    * When a user enters invalid data on the sign-up form, the app will display validation errors in the form, and also repopulate the form with the valid entries. <br />

### Log in

* Registered but unauthorized users may log into the website via a login form.
  * A user accesses the sign-up form by clicking the profile button on the left side of the page, then clicking the Log in button, at which point a modal appears:
    * A user is able to enter their email and password on a clearly laid out form. The user also has an option to login as demo user 1 or demo user 2.
    * A user will be logged in upon successful completion of the sign-up form or by clicking 'login as demo user' <br />
    * The sign-up form's submit button is disabled if the user hasn't entered data for a required field.
    * When a user enters invalid data on the log-in form, 
    the form will display validation errors below the field where the error occured. 
   
### Demo User

* As mentioned above, unregistered and unauthorized users can login as a demo user via the link at the bottom of the login form; two demo user options are available.
Clicking the link logs the user in as a guest so they can use the site as a standard user.

### Log Out

* Logged-in users can end their session by clicking the user profile button at the top-left side of the page, then by clicking the Log Out button.
  * Once the user has logged out, the user's workspace, channel, and direct message data are cleared from the UI.

## Workspaces

### View Workspaces

* Logged-in users' workspaces appear in the workspaces container on the top left of the screen; the container shows only workspaces that user is a member of or owns. 
  * Selecting a workspace causes associated data to display (channels, direct messages). Further explanation in following sections

### Create New Workspaces

* Logged-in users can create a new workspace by clicking the 'plus' icon above the Workspaces container; clicking the icon opens a modal, prompting the user to enter a workspace name.
 * If the user has not entered a workspace name of at least 4 characters, the submit button is disabled.
 * If the user enters a workspace name that already exists, they will see a validation error and be given the option to re-submit
 * A successfully created workspace will appear in the workspace container alongside preexisting workspaces


### Updating Workspaces
* Logged-in users will see three icons alongside their owned workspaces in the workspacec container: an arrow, a gear, and a trash can. 
  * Clicking the arrow icon opens a modal, prompting the user to invite another to the workspace by entering their email. 
    * If the email field is empty or does not contain data with valid email syntax, the send button is disabled.
    * If an email is submitted that is not in the database, a validation error will appear in the form and the user will be allowed to edit and re-submit.
    * If a valid email is entered, a new user will be added to the workspace. The new user's profile appears in the Direct Messages container. (The new user can "reject" the invite by leaving workspace)
  * Clicking the gear icon opens a modal, prompting the user to edit the workspace name. 
    * If the name field is empty for does not contain at least 4 characters, the submit button is disabled.
    * If the name entered is already in the database, a validation error will appear in the form and the user will be allowed to change the name and resubmit.
    * If a valid name is entered, the new workspace name will appear throughout
* A logged-in user inside a workspace that they own will see a profile icon with an 'x' next to alongside each user in the dm container.
  * Clicking this icon will open a modal, asking the workspace owner if they would like to remove the member from the workspace. 
    * Clicking 'no' closes the modal
    * Clicking 'yes' removes the user from the worksapce and closes the modal. The deleted user data will persist throught the workspace, but that user will no longer have access. 
  * Clicking the trash can icon opens a modal, asking they user if they would like to delete the workspace
    * clicking 'no' closes the modal; the workspace remains
    * clicking 'yes' deletes the workspace and all its associated data
  
### Deleting Workspaces
* Logged-in users will see three icons alongside their owned workspaces in the workspacec container: an arrow, a gear, and a trash can. 
  * Clicking the trash can icon opens a modal, asking they user if they would like to delete the workspace
    * clicking 'no' closes the modal; the workspace remains
    * clicking 'yes' deletes the workspace and all its associated data

## Channels

### View All Channels
* Channels belong to workspaces. If a user selects a workspace, they will see a list of its associated channels inside the Channels container on the middle-left side of the page.
* Selecting a channel causes the channel thread to appear on page's main element.

### Create Channels
* Within a workspace, logged-in users can create a new channel by clicking the '+' icon above the 'Channels' container.
  * Clicking the '+' icon opens a modal, prompting the user to enter a name, topic (optional), and description (optional)
    * If the name entered is already exists within the current workspace, a validation error will display in the form; the user can edit the name and re-submit
    * If valid data are entered, the new channel will appear in the channel container

### Update Channels
* Within a workspace, the workspace owner or channel creator can edit a channel by clicking the gear icon associated with the channel name. (The icon does not appear if the user is not authorized to edit)
  * Clicking the gear icon opens a modal, prompting the user to edit the channel. The same validators for creating a new channel apply.
    * If valid data are entered, the channel's update name will appear throughout

### Delete Channels
* A channel owner or Workspace owner who is logged in can click the 'remove channel' button at the bottom of the channel list.
  * Clicking the button opens a modal with a list of channels and a 'delete' button. The user can select channels to delete. Clicking the 'delete' button closes the modal and deletes the channel from the channel list.

## Messages

### View All Messages
* A logged-in user's messages are oraganized via channels and direct messages on the left side of the page.
  * Clicking on a channel or direct message will open the channel or message conversation on the main part of the page

### Send Messages
* A logged-in user can send a direct message or message in channel to workspace of which the belong
  * Clicking on a channel or direct message will open the channel or message conversation on the main part of the page
  * The bottom of the page will show a text area for the user to type a message. The textarea has a send icon; clicking the icon sends the message to the conversation

### Edit Messages
* If a user click on a message that they authored, an edit button appears.
  * Clicking the edit button will allow them to edit their message

### Delete Messages
* If a user click on a message that they authored, a delete button appears.
  * Clicking the delete button will allow them to delete their message

## Reactions

### View All Reactions
* If a logged-in user who is a member of a workspace clicks on the reaction icon on the message,

### Send Reactions
* If a logged-in user who is a member of a workspace clicks on the reaction icon on a message, they will add a reaction to the message
### Delete Reactions
* If a logged-in user who is a member of a workspace clicks on the reaction icon on a message they have already reacted to, they will delete their reaction
