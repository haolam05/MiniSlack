import { NavLink } from "react-router-dom";
import { getAvatarUrl } from "../../utils/image";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ProfileButton from "./ProfileButton";
import UserProfile from "../UserProfile";
import Loading from "../Loading/Loading";
import * as sessionActions from "../../redux/session";
import "./Navigation.css";
import { userIsValid } from "../../utils/user";

function Navigation() {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector(sessionActions.sessionUser);

  const showUserProfile = () => {
    setModalContent(<UserProfile user={user} />);
  }

  useEffect(() => {
    const loadUser = async () => {
      await dispatch(sessionActions.restoreSession());
      setIsLoaded(true);
    }
    loadUser();
  }, [dispatch]);

  if (!isLoaded) return <Loading />;

  return (
    <div id="navbar">
      <ul>
        <li>
          <NavLink to="/"><img src="/images/logo.png" alt="logo" /></NavLink>
        </li>
        <li id="profile-buttons">
          <ProfileButton user={userIsValid(user) ? user : null} />
        </li>
        <div onClick={showUserProfile} id="user-avatar">
          {userIsValid(user) && <img src={getAvatarUrl(user.profile_image_url)} alt="avatar" />}
        </div>
      </ul>
    </div>
  );
}

export default Navigation;

// await fetch("/api/workspaces", {
//   "headers": {
//     "Set-Cookie": "csrf_token=IjU2M2RhMGRjNDZjOGY3MGM2ZGNkYjU3YjE2N2M2MTQwMTM1NmY4OTYi; HttpOnly; Path=/"
//   }
// })
