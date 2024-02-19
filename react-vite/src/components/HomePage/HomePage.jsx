import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as workspaceActions from "../../redux/workspaces";
import "./HomePage.css";
import Loading from "../Loading/Loading";

function HomePage() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const workspaces = useSelector(state => state.workspaces);

  useEffect(() => {
    const loadWorkspace = async () => {
      const data = await dispatch(workspaceActions.loadWorkspaces());
      console.log(data)
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
          asdsad
        </div>
      </div>
    </div>
  );
}

export default HomePage;
