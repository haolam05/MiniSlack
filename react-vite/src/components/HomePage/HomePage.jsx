import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formattedDate, formattedTime } from "../../utils/dateFormatter";
import { formatUserChannel, userIsValid } from "../../utils/user";
import { select } from "../../utils/dom";
import { getAvatarUrl } from "../../utils/image";
import { useModal } from "../../context/Modal";
import { sortDesc } from "../../utils/sort";
import { io } from 'socket.io-client';
import Loading from "../Loading";
import UserProfile from "../UserProfile";
import Workspaces from "../Workspaces";
import Channels from "../Channels";
import Memeberships from "../Memberships";
import Messages from "../Messages";
import ChannelInfo from "../ChannelInfo";
import WelcomeModal from "../WelcomeModal";
import * as sessionActions from "../../redux/session";
import * as workspaceActions from "../../redux/workspace";
import * as channelActions from "../../redux/channel";
import * as messageActions from "../../redux/message";
import * as membershipActions from "../../redux/membership";
import "./HomePage.css";

let socket;

function HomePage() {
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal();
  const [isLoaded, setIsLoaded] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [editMessageInput, setEditMessageInput] = useState("");
  const [newMessageNotification, setNewMessageNotification] = useState(false);
  const user = useSelector(sessionActions.sessionUser);
  const workspaces = useSelector(workspaceActions.getWorkspaces);
  const channels = useSelector(channelActions.getChannels);
  const messages = useSelector(messageActions.getMessages);
  const memberships = useSelector(membershipActions.getMemberships);
  const emojis = useSelector(sessionActions.getEmojis);

  useEffect(() => {
    const handleCreateMessage = message => {
      // the receiver is the currently logged in user and sender is the currently selected member that we are talking to
      if (message.is_private) {
        if (message.receiver_id === user?.id) {    // current user === receiver
          const workspace = document.querySelector(".workspace.selected");
          const member = document.querySelector(".workspace-message.selected");
          if (member && +member.id === message.sender_id) { // selected message (ongoing conversation) ---> use msg notification (weixin)
            dispatch(messageActions.addMessageThunk(message));
            document.querySelector(".new-message").classList?.remove("hidden");
            setNewMessageNotification(message.sender_id !== message.receiver_id);
          } else if (workspace && +workspace.id === message.workspace_id) {  // bell
            const selectedMessage = document.querySelector(`.member-${message.sender_id}`);
            if (selectedMessage) {
              const bell = document.querySelector(`[data-member-id="${message.sender_id}"]`);
              if (bell) bell.classList.remove('hidden');
            }
          }
        }
      } else {  // channel message; if channel is selected, use message notification(weixin), else, use channel notification(bell)
        if (message.sender_id !== user?.id) {
          const channel = document.querySelector(".workspace-channel.selected");
          if (channel && +channel.id === message.channel_id) {  // weixin
            dispatch(messageActions.addMessageThunk(message));
            document.querySelector(".new-message").classList.remove("hidden");
            setNewMessageNotification(true);
          } else {  // bell
            const selectedChannel = document.querySelector(`.channel-${message.channel_id}`);
            if (selectedChannel) {
              const bell = document.querySelector(`[data-channel-id="${message.channel_id}"]`);
              if (bell) bell.classList.remove('hidden');
            }
          }
        }
      }
    }

    const handleUpdateMessage = message => {
      const workspace = document.querySelector(".workspace.selected");
      if (message.sender_id !== user?.id && workspace && +workspace.id === message.workspace_id) {
        if (message.is_private) {
          const member = document.querySelector(".workspace-message.selected");
          if (member && user?.id === message.receiver_id && +member.id === message.sender_id) {
            const messageEl = document.querySelector(`.message-${message.id}>.message-details>div+div`);
            if (messageEl) messageEl.textContent = message.message;
          }
        } else {
          const channel = document.querySelector(".workspace-channel.selected");
          if (channel && +channel.id === message.channel_id) {
            const messageEl = document.querySelector(`.message-${message.id}>.message-details>div+div`);
            if (messageEl) messageEl.textContent = message.message;
          }
        }
      }
    }

    const handleDeleteMessage = (message) => {
      const workspace = document.querySelector(".workspace.selected");
      if (message.sender_id !== user?.id && workspace && +workspace.id === message.workspace_id) {
        if (message.is_private) {
          const member = document.querySelector(".workspace-message.selected");
          if (member && user?.id === message.receiver_id && +member.id === message.sender_id) {
            const messageEl = document.querySelector(`.message-${message.id}`);
            if (messageEl) messageEl.classList.add("hidden");
          }
        } else {
          const channel = document.querySelector(".workspace-channel.selected");
          if (channel && +channel.id === message.channel_id) {
            const messageEl = document.querySelector(`.message-${message.id}`);
            if (messageEl) messageEl.classList.add("hidden");
          }
        }
      }
    }

    const handleDeleteMember = ({ member_id, workspace }) => {
      if (member_id === user?.id) {
        dispatch(channelActions.reset());
        dispatch(messageActions.reset());
        dispatch(membershipActions.reset());
        dispatch(workspaceActions.deleteWorkspaceAction(workspace.id));
        setModalContent(<div>
          <h2 className="subheading">Notification</h2>
          <br />
          <p>You have been removed from &quot;{workspace.name}&quot; workspace.</p>
        </div>);
      }
    }

    const handleMemberLeave = ({ workspace, member }) => {
      if (user?.id === workspace.owner_id) {
        setModalContent(<div>
          <h2 className="subheading">Notification</h2>
          <br />
          <p>{member.first_name} {member.last_name} just leaved the &quot;{workspace.name}&quot; workspace.</p>
        </div>);
      }
    }

    const handleInviteMember = ({ member_id, workspace }) => {
      if (member_id === user?.id) {
        dispatch(workspaceActions.createWorkspaceAction(workspace));
        setModalContent(<div>
          <h2 className="subheading">Notification</h2>
          <br />
          <p>You have been added to &quot;{workspace.name}&quot; workspace.</p>
        </div>);
      }
    }

    const handleUpdateWorkspace = ({ member_ids, workspace, old_name }) => {
      if (member_ids.includes(user?.id)) {
        dispatch(workspaceActions.editWorkspaceAction(workspace));
        setModalContent(<div>
          <h2 className="subheading">Notification</h2>
          <br />
          <p>&quot;{old_name}&quot; workspace has updated its name to &quot;{workspace.name}&quot;.</p>
        </div>);
      }
    }

    const handleDeleteWorkspace = ({ member_ids, workspace }) => {
      if (member_ids.includes(user?.id)) {
        dispatch(channelActions.reset());
        dispatch(messageActions.reset());
        dispatch(membershipActions.reset());
        dispatch(workspaceActions.deleteWorkspaceAction(workspace.id));
        setModalContent(<div>
          <h2 className="subheading">Notification</h2>
          <br />
          <p>&quot;{workspace.name}&quot; workspace has been deleted.</p>
        </div>);
      }
    }

    const handleCreateChannel = ({ member_ids, channel, workspace }) => {
      if (member_ids.includes(user?.id)) {
        dispatch(channelActions.createChannelsAction(channel));
        setModalContent(<div>
          <h2 className="subheading">Notification</h2>
          <br />
          <p>&quot;{workspace.name}&quot; workspace just added a new channel called &quot;{channel.name}&quot;. Check it out!</p>
        </div>);
      }
    }

    const handleUpdateChannel = ({ member_ids, workspace, channel, old_name }) => {
      if (member_ids.includes(user?.id)) {
        const workspaceEl = document.querySelector(".workspace.selected");
        const isChannelChat = document.querySelector(".workspace-channel.selected");
        if (workspaceEl && +workspaceEl.id === workspace.id) {
          dispatch(channelActions.updateChannelAction(channel));
          if (isChannelChat && +isChannelChat.id === channel.id) {
            dispatch(messageActions.loadChannelMessages(channel.id));
            const messageHeader = document.querySelector(".message-header");
            messageHeader.innerHTML = channelHeaderText(channel.name);
            messageHeader.querySelector("#channel-info").addEventListener('click', () => {
              setModalContent(<ChannelInfo headerName={channel.name} c={channel} />)
            });
          }
        }
        if (old_name !== channel.name) {
          setModalContent(<div>
            <h2 className="subheading">Notification</h2>
            <br />
            <p>&quot;{old_name}&quot; channel from &quot;{workspace.name}&quot; workspace has updated its content and changed its name to &quot;{channel.name}&quot;.</p>
          </div>);
        } else {
          setModalContent(<div>
            <h2 className="subheading">Notification</h2>
            <br />
            <p>&quot;{old_name}&quot; channel from &quot;{workspace.name}&quot; workspace has updated its content.</p>
          </div>);
        }
      }
    }

    const handleDeleteChannel = ({ member_ids, workspace, channel }) => {
      if (member_ids.includes(user?.id)) {
        setModalContent(<div>
          <h2 className="subheading">Notification</h2>
          <br />
          <p>&quot;{channel.name}&quot; channel from &quot;{workspace.name}&quot; workspace has been deleted.</p>
        </div>);
        const workspaceEl = document.querySelector(".workspace.selected");
        const channelEl = document.querySelector(`.channel-${channel.id}`);
        const isChannelChat = document.querySelector(".workspace-channel.selected");
        if (workspace && channelEl && +workspaceEl.id === workspace.id) {
          dispatch(channelActions.deleteChannelAction(channel.id));
          if (isChannelChat) {
            dispatch(messageActions.reset());
            clearMessageHeader();
          }
        }
      }
    }

    const handleCreateReaction = ({ message, new_reaction }) => {
      const workspace = document.querySelector(".workspace.selected");
      const channel = document.querySelector(`.workspace-channel.selected.channel-${message.channel_id}`);
      const member = document.querySelector(`.workspace-message.selected.member-${new_reaction.user_id}`);
      if (user?.id !== new_reaction.user_id && workspace && +workspace.id === message.workspace_id) {
        if (member || channel) {
          const reactions = document.querySelector(`.reaction-message-${message.id}`);
          if (reactions) {
            const reactionExist = document.querySelector(`#reaction-${new_reaction.id}`);
            if (reactionExist) return;
            const reaction = document.createElement('div');
            reaction.classList.add("reaction");
            reaction.classList.add("not-me");
            reaction.setAttribute("title", `${new_reaction.user?.first_name} ${new_reaction.user?.last_name}`)
            reaction.textContent = new_reaction.encoded_text;
            reaction.setAttribute("id", `reaction-${new_reaction.id}`);
            reaction.addEventListener("click", e => e.stopPropagation());
            reactions.append(reaction);
          }
        }
      }
    }

    const handleDeleteReaction = ({ message, reaction }) => {
      const workspace = document.querySelector(".workspace.selected");
      const channel = document.querySelector(`.workspace-channel.selected.channel-${message.channel_id}`);
      const member = document.querySelector(`.workspace-message.selected.member-${reaction.user_id}`);
      if (user?.id !== reaction.user_id && workspace && +workspace.id === message.workspace_id) {
        if (member || channel) {
          const reactionEl = document.querySelector(`#reaction-${reaction.id}`);
          if (reactionEl) reactionEl.remove();
        }
      }
    }

    const handleWorkspaceOnlineOffline = onlineIds => {
      if (user && onlineIds.includes(user?.id)) {
        const members = document.querySelectorAll(".workspace-message");
        const searchbox = members[0]?.parentElement.firstChild;
        for (let i = 0; i < members.length; i++) {
          const member = members[i];
          const onlineSignal = document.querySelector(`.member-${+member.id} .online>i`);
          if (onlineIds.includes(+member.id)) {
            onlineSignal.classList.remove("hidden");
            member.parentElement.prepend(member);
            if (searchbox) member.parentElement.prepend(searchbox);
          } else {
            onlineSignal.classList.add("hidden");
          }
        }
      }
    }

    const handleOffline = onlines => {
      const workspace = document.querySelector(".workspace.selected");
      if (workspace) {
        const workspaceId = +workspace.id;
        const onlineIds = onlines[workspaceId];
        handleWorkspaceOnlineOffline(onlineIds);
      }
    }

    clearMessageHeader();
    const loadData = async () => {
      const url = import.meta.env.MODE === 'development' ? "http://127.0.0.1:8000" : "https://minislack.onrender.com";
      socket = io(url);
      socket.on("new_message", handleCreateMessage);
      socket.on("update_message", handleUpdateMessage);
      socket.on("delete_message", handleDeleteMessage);
      socket.on("invite_member", handleInviteMember);
      socket.on("remove_member", handleDeleteMember);
      socket.on("member_leave", handleMemberLeave);
      socket.on("update_workspace", handleUpdateWorkspace);
      socket.on("delete_workspace", handleDeleteWorkspace);
      socket.on("create_channel", handleCreateChannel);
      socket.on("update_channel", handleUpdateChannel);
      socket.on("delete_channel", handleDeleteChannel);
      socket.on("create_reaction", handleCreateReaction);
      socket.on("delete_reaction", handleDeleteReaction);
      socket.on("enter_workspace", handleWorkspaceOnlineOffline);
      socket.on("leave_workspace", handleWorkspaceOnlineOffline);
      socket.on("offline", handleOffline);

      await dispatch(sessionActions.restoreSession());
      await dispatch(sessionActions.loadEmojis());
      if (userIsValid(user)) {
        await dispatch(workspaceActions.loadWorkspaces());
      }
      setIsLoaded(true);

      return () => socket.disconnect();
    }
    loadData();
  }, [dispatch, user, setModalContent]);

  const clearMessageHeader = () => {
    const messageHeader = document.querySelector(".message-header");
    if (messageHeader) messageHeader.textContent = "";
  }

  const clearNotification = () => {
    const notification = document.querySelector(".notification");
    if (notification) {
      notification.classList.add("hidden");
      setNewMessageNotification(false);
    }
  }

  const channelHeaderText = channelName => {
    return `<div style="display: flex; gap: 10px; align-items: center;">
      <span>${channelName}</span>
      <span id="channel-info"><i style="font-size: 11pt; cursor: pointer;" class="fa-solid fa-circle-info" title="Details"></i></span>
    </div>`;
  }

  const showUserProfile = (e, member) => {
    e.stopPropagation();
    setModalContent(<UserProfile user={member} setModalContent={setModalContent} closeModal={closeModal} showSettings={false} />);
  }

  const collapseWorkspaces = e => {
    const parentEl = e.target.closest("#workspaces");
    if (parentEl) {
      parentEl.querySelector(".workspaces-list").classList.toggle("hidden");
    }
  }

  const showChannelsAndMemberships = async e => {
    const oldWorkspace = document.querySelector(".workspace.selected");
    const oldWorkspaceId = oldWorkspace ? +oldWorkspace.id : null;

    clearNotification();
    select(e);
    const workspace = e.target.closest(".workspace");
    if (!workspace) return;
    const different_workspace = await dispatch(channelActions.loadChannels(+workspace.id));
    const selectedDm = document.querySelector(".workspace-message.selected");
    if (different_workspace && selectedDm) selectedDm.classList.remove("selected");
    await dispatch(membershipActions.loadMemberships(+workspace.id));
    if (different_workspace) {
      clearMessageHeader();
      if (oldWorkspaceId) {
        socket.emit("leave_workspace", { workspace_id: oldWorkspaceId, user_id: user?.id });
      }
      socket.emit("enter_workspace", { workspace_id: +workspace.id, user_id: user?.id });
    }
  }

  const showChannelMessages = async (e, c) => {
    clearNotification();
    select(e);
    const channel = e.target.closest(".workspace-channel");
    if (!channel) return;
    const headerName = getChannelMessagesHeader();
    const selected = document.querySelector(".workspace-message.selected");
    if (headerName) {
      const messageHeader = document.querySelector(".message-header");
      messageHeader.innerHTML = channelHeaderText(headerName);
      messageHeader.querySelector("#channel-info").addEventListener('click', () => setModalContent(<ChannelInfo headerName={headerName} c={c} />));
    }
    if (selected) selected.classList.remove("selected");
    await dispatch(messageActions.loadChannelMessages(+channel.id));


    const bell = document.querySelector(`[data-channel-id="${+channel.id}"]`);
    if (bell) bell.classList.add("hidden");
  }

  const showDirectMessages = async (e, id, workspaceId) => {
    clearNotification();
    select(e);
    const headerName = getDirectMessagesHeader();
    const selected = document.querySelector(".workspace-channel.selected");
    if (headerName) document.querySelector(".message-header").textContent = headerName;
    if (selected) selected.classList.remove("selected");
    await dispatch(messageActions.loadDirectMessages(id, user?.id, workspaceId));

    const member = e.target.closest(".workspace-message");
    if (!member) return;
    const bell = document.querySelector(`[data-member-id="${+member.id}"]`);
    if (bell) bell.classList.add("hidden");
  }

  const hideEditMessageForm = e => {
    const message = e.target.closest(".message");
    if (message) {
      const messageDetails = message.querySelector(".message-details>div");
      const form = message.querySelector(".edit-message-form");
      if (form && !form.classList.contains("hidden") && !message.children[1].classList.contains("hidden")) {
        form.classList.add("hidden");
        messageDetails.classList.remove("hidden");
        setEditMessageInput(messageDetails.textContent);
      }
    }
  }

  const showMessageTime = e => {
    e.stopPropagation();
    hideEditMessageForm(e);

    const timeEl = e.target.querySelector(".message-time");
    if (timeEl) {
      timeEl.classList.toggle("hidden");
    } else {
      const parentEl = e.target.closest(".message");
      if (parentEl) {
        const children = parentEl.children;
        if (children[1]) children[1].classList.toggle("hidden");
      }
    }
    const reactions = document.querySelector(".reaction-emojis-list");
    if (reactions) reactions.classList.toggle("hidden");
  }

  const getDirectMessagesHeader = () => {
    const receiver = document.querySelector(".workspace-message.selected");
    if (receiver) {  // private messages
      const span = receiver.querySelector("span");
      if (span) return span.textContent;
    }
  }

  const getChannelMessagesHeader = () => {
    const channel = document.querySelector(".workspace-channel.selected");
    if (channel) return formatUserChannel(channel.innerText);
  }

  const getMessageAuthorImage = m => {
    const author = memberships.find(member => member.id === m.sender_id);
    if (author) return getAvatarUrl(author.profile_image_url);
  }

  const getMessageAuthorName = m => {
    const author = memberships.find(member => member.id === m.sender_id);
    if (author) return `${author.first_name} ${author.last_name}`
  }

  if (!isLoaded) return <Loading />;

  return (
    <div id="home-page">
      <div id="sidebar">
        <Workspaces
          user={user}
          workspaces={sortDesc(workspaces)}
          showChannelsAndMemberships={showChannelsAndMemberships}
          collapseWorkspaces={collapseWorkspaces}
        />
        <Channels
          user={user}
          channels={sortDesc(channels)}
          collapseWorkspaces={collapseWorkspaces}
          showChannelMessages={showChannelMessages}
          channelHeaderText={channelHeaderText}
        />
        <Memeberships
          user={user}
          memberships={memberships}
          collapseWorkspaces={collapseWorkspaces}
          showUserProfile={showUserProfile}
          showDirectMessages={showDirectMessages}
          getAvatarUrl={getAvatarUrl}
        />
      </div>
      <div id="main-content">
        {!user?.id ? <WelcomeModal /> : (
          <Messages
            user={user}
            messages={messages}
            showMessageTime={showMessageTime}
            getMessageAuthorImage={getMessageAuthorImage}
            formattedDate={formattedDate}
            formattedTime={formattedTime}
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            editMessageInput={editMessageInput}
            setEditMessageInput={setEditMessageInput}
            emojis={emojis}
            getMessageAuthorName={getMessageAuthorName}
            newMessageNotification={newMessageNotification}
            setNewMessageNotification={setNewMessageNotification}
            socket={socket}
          />
        )}
      </div>
    </div>
  );
}

export default HomePage;
