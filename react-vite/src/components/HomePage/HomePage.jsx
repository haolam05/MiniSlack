import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userIsValid } from "../../utils/user";
import Loading from "../Loading";
import * as workspaceActions from "../../redux/workspace";
import * as sessionActions from "../../redux/session";
import "./HomePage.css";

function HomePage() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector(sessionActions.sessionUser);
  const workspaces = useSelector(workspaceActions.getWorkspaces);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(sessionActions.restoreSession);
      if (userIsValid(user)) await dispatch(workspaceActions.loadWorkspaces());
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
                  key={w.id}
                  className="workspace"
                >
                  {w.name}
                </div>
              ))}
              {workspaces.map(w => (
                <div
                  key={w.id}
                  className="workspace"
                >
                  {w.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div id="channels">
          <h2 className="subheading">Channels</h2>
        </div>
        <div id="messages">
          <h2 className="subheading">Direct Messages</h2>
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
