import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userIsValid } from "../../utils/user";
import Loading from "../Loading";
import { select } from "../../utils/dom";
import * as sessionActions from "../../redux/session";
import * as workspaceActions from "../../redux/workspace";
import * as channelActions from "../../redux/channel";
import * as messageActions from "../../redux/message";
import * as membershipActions from "../../redux/membership";
import "./HomePage.css";
import { getAvatarUrl } from "../../utils/image";

function HomePage() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector(sessionActions.sessionUser);
  const workspaces = useSelector(workspaceActions.getWorkspaces);
  const channels = useSelector(channelActions.getChannels);
  const messages = useSelector(messageActions.getMessages);
  const memberships = useSelector(membershipActions.getMemberships);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(sessionActions.restoreSession);
      if (userIsValid(user)) {
        await dispatch(workspaceActions.loadWorkspaces());
      }
      setIsLoaded(true);
    }
    loadData();
  }, [dispatch, user]);

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
  }

  const showMessages = async e => {
    select(e);
    await dispatch(messageActions.loadMessages(+e.target.id));
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
                  className="workspace"
                  onClick={showMessages}
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
                  className="workspace"
                  onClick={showMessages}
                >
                  <img src={getAvatarUrl(m.profile_image_url)} alt="avatar" /> {m.first_name} {m.last_name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div id="main-content">
        <div id="chat-window">
        </div>
      </div>
    </div >
  );
}

export default HomePage;
