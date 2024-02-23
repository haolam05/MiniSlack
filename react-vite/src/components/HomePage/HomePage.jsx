import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formattedDate, formattedTime } from "../../utils/dateFormatter";
import { formatUserChannel, userIsValid } from "../../utils/user";
import { select } from "../../utils/dom";
import { getAvatarUrl } from "../../utils/image";
import { useModal } from "../../context/Modal";
import { sortDesc } from "../../utils/sort";
import Loading from "../Loading";
import UserProfile from "../UserProfile";
import Workspaces from "../Workspaces";
import Channels from "../Channels";
import Memeberships from "../Memberships";
import Messages from "../Messages";
import ChannelInfo from "../ChannelInfo";
import * as sessionActions from "../../redux/session";
import * as workspaceActions from "../../redux/workspace";
import * as channelActions from "../../redux/channel";
import * as messageActions from "../../redux/message";
import * as membershipActions from "../../redux/membership";
import "./HomePage.css";

function HomePage() {
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal();
  const [isLoaded, setIsLoaded] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [editMessageInput, setEditMessageInput] = useState("");
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
    clearMessageHeader();
    const loadData = async () => {
      await dispatch(sessionActions.restoreSession());
      await dispatch(sessionActions.loadEmojis());
      if (userIsValid(user)) {
        await dispatch(workspaceActions.loadWorkspaces());
      }
      setIsLoaded(true);
    }
    loadData();
  }, [dispatch, user]);

  const scrollToNewMessage = () => {
    const chatWindow = document.querySelector(".messages-details-wrapper");
    const messageElHeight = 84; // px
    if (chatWindow && Math.abs(chatWindow.scrollHeight - messageElHeight - (chatWindow.clientHeight + chatWindow.scrollTop) <= 2)) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
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
    const chatWindow = document.querySelector(".messages-details-wrapper");
    if (chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  const showDirectMessages = async (e, id, workspaceId) => {
    select(e);
    const headerName = getDirectMessagesHeader();
    const selected = document.querySelector(".workspace-channel.selected");
    if (headerName) document.querySelector(".message-header").textContent = headerName;
    if (selected) selected.classList.remove("selected");
    await dispatch(messageActions.loadDirectMessages(id, user.id, workspaceId));
    const chatWindow = document.querySelector(".messages-details-wrapper");
    if (chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight;
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

  if (!isLoaded) return <Loading />

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
          scrollToNewMessage={scrollToNewMessage}
          editMessageInput={editMessageInput}
          setEditMessageInput={setEditMessageInput}
          emojis={emojis}
          getMessageAuthorName={getMessageAuthorName}
        />
      </div>
    </div>
  );
}

export default HomePage;
