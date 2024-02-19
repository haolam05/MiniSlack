import { useSelector } from "react-redux";
import { getAvatarUrl } from "../../utils/image";
import * as sessionActions from "../../redux/session";
import "./UserProfile.css";

function UserProfile() {
  const user = useSelector(sessionActions.sessionUser);

  return (
    <>
      <h2 className="subheading">User Profile</h2>
      <div id="user-profile">
        <div className="profile-avatar">
          <img src={getAvatarUrl(user.profile_image_url)} alt="avatar" />
        </div>
        <div className="profile-content">
          <div className="profile-titles">
            <div>First name</div>
            <div>Last name</div>
            <div>Username</div>
            <div>Email</div>
          </div>
          <div className="profile-details">
            <div>{user.first_name}</div>
            <div>{user.last_name}</div>
            <div>{user.username}</div>
            <div>{user.email}</div>
          </div>
        </div>
      </div>
    </>
  );
}


export default UserProfile;
