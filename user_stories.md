# MiNiSlack User Stories

## Users

### Sign Up

* Unregistered and unauthorized users are able to sign up for the website via a sign-up form.
  * A user accesses the sign-up form by clicking the profile button on the left side of the page, then clicking the sign up button, at which point a modal appears:
    * A user is able to enter their first name, last name, email, username, password, and profile image (optional) on a clearly laid out form.
    * A user will be logged in upon successful completion of the sign-up form, seamlessly accessing the site's functionality
    * The sign-up form's submit button is disabled if the user hasn't entered data for a required field.
    * When a user enters invalid data on the sign-up form, the website will display validation errors in the form, and also repopulate the form with the valid entries. <br />

### Log in

* Registered but unauthorized users may log into the website via a log-in form.
  * A user accesses the sign-up form by clicking the profile button on the left side of the page, then clicking the Log in button, at which point a modal appears:
    * A user is able to enter their email and password on a clearly laid out form. The user also has an option to login as a demo user.
    * A user will be logged in upon successful completion of the sign-up form or by clicking 'login as demo user' <br />
    * The sign-up form's submit button is disabled if the user hasn't entered data for a required field.
    * When a user enters invalid data on the log-in form, 
    the form will display validation errors. 
   
### Demo User

* As mentioned above, unregistered and unauthorized users can login as a demo user via the link at the bottom of the login form.
Clicking the link logs the user in as a guest so they can use the site as a standard user.

### Log Out

* Logged in users can log out via an easy to find log out button on the navigation bar.
    * The log out button is in the nav bar, which appears on all pages of the site. Upon logout, the user is redirected to the <br />
    sign in page.

## Workspaces

### View Workspaces

* As a logged in user, I want to be able to view all workspaces of which I own or just as a member.
  * When on the `/workspaces` page:
    * A user can see the workspaces of which they own or are a member. 
    * When a users clicks on a workspace card, the page will redirect to `/workspaces/:workspaceId`, where they're able to see channels and dms

### Create New Workspaces

* Logged in users can create a new workspace.
  * When a user clicks on the "CREATE A NEW WORKSPACE" button, they are redirected to `/workspaces/new` page:
    * the `/workspaces/new` page has a simple form that prompts the user to input a workspace name, a first channel, <br />
    and a list of member emails
      * an invalid sign-up form shows validation errors in the form but also repopulates the form with valid data
    * successful login redirects the user to the new workspace (`/workspaces/:workspaceId`)

### Updating Workspaces
* An 'edit workspace' button appears below each workspace on the `/workspaces` page that the user owns. <br /> 
    * Clicking the button opens a modal that shows the workspace title, channels, and members
    * The user can edit the title, add/remove channels, add/remove members

### Deleting Workspaces
* A 'delete workspace' button appears below each workspace on the `/workspaces` page that the user owns . <br /> 
    * confirmation modal??
    * Clicking the button deletes the workspace

## Channels

### View All Channels
* Logged in users can view all channels in a workspace.
* Channels appear on the left side of the page within a workspace

### Create Channels
* Logged in users can create a new channel by clicking the 'create new channel' <br/>
at the bottom of the channel list
  * clicking the button opens a modal with a simple form where the user enters a <br/>channel name
  * if a channel is successfully created, the modal closes and the the new channel <br/>appears in the channel list
  * an invalid form submit shows validation errors in the form but also repopulates <br/>the form with valid data

### Update Channels
* Logged in users who own the workspace or the channel can edit the channel name via a button

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
  * The bottom of the page will show a text area for the user to type a message. The textarea has a send icon; clicking the icon or pressing enter sends the message to the conversation

### Edit Messages
* If a user hovers over a message that they authored, an edit button appears.
  * Clicking the edit button will allow them to edit their message

### Delete Messages
* If a user hovers over a message that they authored, a delete button appears.
  * Clicking the delete button will allow them to delete their message

## Reactions

### View All Reactions
* If a logged-in user who is a member of a workspace clicks on the reaction icon on the message,

### Send Reactions
* If a logged-in user who is a member of a workspace clicks on the reaction icon on a message, they will add a reaction to the message
### Delete Reactions
* If a logged-in user who is a member of a workspace clicks on the reaction icon on a message they have already reacted to, they will delete their reaction
