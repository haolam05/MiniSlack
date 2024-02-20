import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatUserChannel, userIsValid } from "../../utils/user";
import { select } from "../../utils/dom";
import { getAvatarUrl } from "../../utils/image";
import { useModal } from "../../context/Modal";
import Loading from "../Loading";
import UserProfile from "../UserProfile";
import * as sessionActions from "../../redux/session";
import * as workspaceActions from "../../redux/workspace";
import * as channelActions from "../../redux/channel";
import * as messageActions from "../../redux/message";
import * as membershipActions from "../../redux/membership";
import "./HomePage.css";
import { formattedDate, formattedTime } from "../../utils/dateFormatter";

function HomePage() {
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal();
  const [isLoaded, setIsLoaded] = useState(false);
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
    if (headerName) document.querySelector(".message-header").textContent = headerName;
    await dispatch(messageActions.loadChannelMessages(+e.target.id));
  }

  const showDirectMessages = async (e, id) => {
    select(e);
    const headerName = getDirectMessagesHeader();
    if (headerName) document.querySelector(".message-header").textContent = headerName;
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
      if (receiver.childNodes) {
        const childNodes = receiver.childNodes;
        let firstName = '';
        let lastName = '';
        if (childNodes[2]) firstName += childNodes[2].textContent;
        if (childNodes[4]) lastName += childNodes[4].textContent;
        return `${firstName} ${lastName}`;
      }
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
        <div id="workspaces">
          <h2 className="subheading">
            <span>Workspaces</span>
            <i onClick={collapseWorkspaces} className="fa-solid fa-window-maximize"></i>
          </h2>
          <div className="workspaces-list-wrapper">
            <div className="workspaces-list">
              {workspaces.map(w => (
                <div
                  id={w.id}
                  key={w.id}
                  className="workspace"
                  onClick={showChannelsAndMemberships}
                >
                  {w.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div id="workspaces" className="channels">
          <h2 className="subheading">
            <span>Channels</span>
            <i onClick={collapseWorkspaces} className="fa-solid fa-window-maximize"></i>
          </h2>
          <div className="workspaces-list-wrapper">
            <div className="workspaces-list">
              {channels.map(c => (
                <div
                  id={c.id}
                  key={c.id}
                  className="workspace workspace-channel"
                  onClick={showChannelMessages}
                >
                  {c.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div id="workspaces" className="direct-messages">
          <h2 className="subheading">
            <span>Direct Messages</span>
            <i onClick={collapseWorkspaces} className="fa-solid fa-window-maximize"></i>
          </h2>
          <div className="workspaces-list-wrapper">
            <div className="workspaces-list">
              {memberships.map(m => (
                <div
                  id={m.id}
                  key={m.id}
                  className="workspace workspace-message"
                  onClick={e => showDirectMessages(e, m.id)}
                >
                  <img onClick={e => showUserProfile(e, m)} src={getAvatarUrl(m.profile_image_url)} alt="avatar" /> {m.first_name} {m.last_name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div id="main-content">
        <div className="messages-wrapper">
          <div className="messages-details-wrapper">
            <div className="message-header"></div>
            {messages.map(m => (
              <div
                id={m.id}
                key={m.id}
                className={`message ${m.sender_id === user.id ? 'me' : ''}`}
                onClick={showMessageTime}
              >
                <div className="message-details">
                  {m.sender_id === user.id ? (
                    <>
                      <div>{m.message}</div>
                      <div className="message-image"><img src={getMessageAuthorImage(m)} alt="avatar" /></div>
                    </>
                  ) : (
                    <>
                      <div className="message-image"><img src={getMessageAuthorImage(m)} alt="avatar" /></div>
                      <div>{m.message}</div>
                    </>
                  )}
                </div>
                <div onClick={e => e.stopPropagation()} className={`hidden message-time ${m.sender_id === user.id ? 'me' : ''}`}>
                  <div>{formattedDate(m.created_at)}</div>
                  <div className="dot"><i className="fa-solid fa-circle"></i></div>
                  <div>{formattedTime(m.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
