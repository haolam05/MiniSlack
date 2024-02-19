import { NavLink } from "react-router-dom";
import { getAvatarUrl } from "../../utils/image";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ProfileButton from "./ProfileButton";
import UserProfile from "../UserProfile";
import Loading from "../Loading/Loading";
import "./Navigation.css";

function Navigation() {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector(sessionActions.sessionUser);


  const showUserProfile = () => {
    setModalContent(<UserProfile />)
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
          <ProfileButton user={user} />
        </li>
        <div onClick={showUserProfile} id="user-avatar">
          {user && <img src={getAvatarUrl(user.profile_image_url)} alt="avatar" />}
        </div>
      </ul>
    </div>
  );
}

export default Navigation;
