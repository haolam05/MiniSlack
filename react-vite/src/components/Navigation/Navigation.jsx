import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <div id="navbar">
      <ul>
        <li>
          <NavLink to="/"><img src="/images/logo.png" alt="logo" /></NavLink>
        </li>
        <li>
          <ProfileButton />
        </li>
      </ul>
    </div>
  );
}

export default Navigation;
