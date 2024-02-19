import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as workspaceActions from "../../redux/workspace";
// import * as sessionActions from "../../redux/session";
import "./HomePage.css";
import Loading from "../Loading/Loading";

function HomePage() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const workspaces = useSelector(state => state.workspaces);
  // const user = useSelector(state => state.session.user);


  useEffect(() => {
    const loadWorkspace = async () => {
      // await dispatch(sessionActions.restoreSession);
      await dispatch(workspaceActions.loadWorkspaces());
      setIsLoaded(true);
    }
    loadWorkspace();
  }, [dispatch]);

  if (!isLoaded) return <Loading />

  return (
    <div id="home-page">
      <div id="sidebar">
        <div id="workspaces"></div>
        <div id="channels"></div>
        <div id="messages"></div>
      </div>
      <div id="main-content">
        <div id="chat-window">
          {workspaces[0]?.name}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
