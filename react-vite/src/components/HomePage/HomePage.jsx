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

  const clearMessageHeader = () => {
    const messageHeader = document.querySelector(".message-header");
    if (messageHeader) messageHeader.textContent = "";
  }

  useEffect(() => {
    const handleNewMessageSocket = message => {
      // console.log(document.hasFocus())
      // the receiver is the currently logged in user and sender is the currently selected member that we are talking to
      if (message.is_private) {
        if (message.receiver_id === user.id) {    // current user === receiver
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

    const handleDeleteMember = ({ member_id, workspace_name }) => {
      if (member_id === user.id) {
        setModalContent(<div>
          <h2 className="subheading">Notification</h2>
          <br />
          <p>You have been removed from &quot;{workspace_name}&quot; workspace.</p>
        </div>);
        setTimeout(() => window.location.reload(), 4000);
      }
    }

    const handleInviteMember = ({ member_id, workspace }) => {
      if (member_id === user.id) {
        dispatch(workspaceActions.createWorkspaceAction(workspace))
        setModalContent(<div>
          <h2 className="subheading">Notification</h2>
          <br />
          <p>You have been added to &quot;{workspace.name}&quot; workspace.</p>
        </div>);
      }
    }


    clearMessageHeader();
    const loadData = async () => {
      const url = import.meta.env.MODE === 'development' ? "http://127.0.0.1:8000" : "https://minislack.onrender.com";
      socket = io(url);
      socket.on("new_message", handleNewMessageSocket);
      socket.on("invite_member", handleInviteMember);
      socket.on("delete_member", handleDeleteMember);

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

  // const scrollToNewMessage = (forceScroll = false) => {
  //   const chatWindow = document.querySelector(".messages-details-wrapper");
  //   if (chatWindow) {
  //     if (forceScroll || chatWindow.scrollHeight === chatWindow.clientHeight + chatWindow.scrollTop) {
  //       chatWindow.scrollTop = chatWindow.scrollHeight;
  //     }
  //   }
  // }

  const clearNotification = () => {
    const notification = document.querySelector(".notification");
    if (notification) {
      notification.classList.add("hidden");
      setNewMessageNotification(false);
    }
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
    clearNotification();
    clearMessageHeader();
    select(e);
    const workspace = e.target.closest(".workspace");
    if (!workspace) return;
    const selectedDm = document.querySelector(".workspace-message.selected");
    if (selectedDm) selectedDm.classList.remove("selected");
    await dispatch(channelActions.loadChannels(+workspace.id));
    await dispatch(membershipActions.loadMemberships(+workspace.id));
    await dispatch(messageActions.reset());
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
      messageHeader.innerHTML = `<div style="display: flex; gap: 10px; align-items: center;">
        <span>${headerName}</span>
        <span id="channel-info"><i style="font-size: 11pt; cursor: pointer;" class="fa-solid fa-circle-info" title="Details"></i></span>
      </div>
      `;
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
    await dispatch(messageActions.loadDirectMessages(id, user.id, workspaceId));

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
      {!user?.id && <WelcomeModal />}
      <div id="main-content">
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
      </div>
    </div>
  );
}

export default HomePage;
