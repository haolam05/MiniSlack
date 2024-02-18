import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async e => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({ confirmPassword: "Confirm Password field must be the same as the Password field" });
    }

    const data = await dispatch(
      sessionActions.signup({
        first_name: firstName,
        last_name: lastName,
        profile_image_url: profileImageUrl,
        email,
        username,
        password,
      })
    );

    if (data?.errors) return setErrors(data);
    closeModal();
  };

  return (
    <>
      <h1>Sign Up</h1>
      {errors.server && <p className="modal-errors">{errors.server}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.first_name && <p className="modal-errors">{errors.first_name}</p>}
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.last_name && <p className="modal-errors">{errors.last_name}</p>}
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="modal-errors">{errors.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className="modal-errors">{errors.username}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="modal-errors">{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p className="modal-errors">{errors.confirmPassword}</p>}
        <label>
          Profil Image
          <input
            type="text"
            value={profileImageUrl}
            onChange={e => setProfileImageUrl(e.target.value)}
          />
        </label>
        {errors.confirmPassword && <p className="modal-errors">{errors.confirmPassword}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;
