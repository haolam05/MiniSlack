import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formattedDate, formattedTime } from "../../utils/dateFormatter";
import { formatUserChannel, userIsValid } from "../../utils/user";
import { select } from "../../utils/dom";
import { getAvatarUrl } from "../../utils/image";
import { useModal } from "../../context/Modal";
import Loading from "../Loading";
import UserProfile from "../UserProfile";
import Workspaces from "../Workspaces";
import Channels from "../Channels";
import Memeberships from "../Memberships";
import Messages from "../Messages";
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
  const user = useSelector(sessionActions.sessionUser);
  const workspaces = useSelector(workspaceActions.getWorkspaces);
  const channels = useSelector(channelActions.getChannels);
  const messages = useSelector(messageActions.getMessages);
  const memberships = useSelector(membershipActions.getMemberships);

  const clearMessageHeader = () => {
    const messageHeader = document.querySelector(".message-header");
    if (messageHeader) messageHeader.textContent = "";
  }

  useEffect(() => {
    clearMessageHeader();
    const loadData = async () => {
      await dispatch(sessionActions.restoreSession);
      if (userIsValid(user)) {
        await dispatch(workspaceActions.loadWorkspaces());
      }
      setIsLoaded(true);
    }
    loadData();
  }, [dispatch, user]);

  const showUserProfile = (_e, member) => {
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
    await dispatch(channelActions.loadChannels(+e.target.id));
    await dispatch(membershipActions.loadMemberships(+e.target.id));
    await dispatch(messageActions.reset());
  }

  const showChannelMessages = async e => {
    select(e);
    const headerName = getChannelMessagesHeader();
    const selected = document.querySelector(".workspace-message.selected");
    if (headerName) document.querySelector(".message-header").textContent = headerName;
    if (selected) selected.classList.remove("selected");
    await dispatch(messageActions.loadChannelMessages(+e.target.id));
  }

  const showDirectMessages = async (e, id) => {
    select(e);
    const headerName = getDirectMessagesHeader();
    const selected = document.querySelector(".workspace-channel.selected");
    if (headerName) document.querySelector(".message-header").textContent = headerName;
    if (selected) selected.classList.remove("selected");
    await dispatch(messageActions.loadDirectMessages(id, user.id));
  }

  const showMessageTime = e => {
    e.stopPropagation();
    const timeEl = e.target.querySelector(".message-time");
    if (timeEl) {
      timeEl.classList.toggle("hidden");
    } else {
      const parentEl = e.target.closest(".message");
      const children = parentEl.children;
      if (children[1]) children[1].classList.toggle("hidden");
    }
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
    if (channel) return formatUserChannel(channel.textContent);
  }

  const getMessageAuthorImage = m => {
    const author = memberships.find(member => member.id === m.sender_id)
    if (author) return getAvatarUrl(author.profile_image_url);
  }

  if (!isLoaded) return <Loading />

  return (
    <div id="home-page">
      <div id="sidebar">
        <Workspaces
          workspaces={workspaces}
          showChannelsAndMemberships={showChannelsAndMemberships}
          collapseWorkspaces={collapseWorkspaces}
        />
        <Channels
          channels={channels}
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
        />
      </div>
    </div>
  );
}

export default HomePage;
