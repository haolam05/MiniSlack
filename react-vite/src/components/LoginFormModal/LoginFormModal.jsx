import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { disabledSubmitButton, enabledSubmitButton } from "../../utils/dom";
import * as sessionActions from "../../redux/session";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { setModalContent } = useModal();

  const handleSubmit = async (e, loginAsDemoUser) => {
    e.preventDefault();
    disabledSubmitButton();

    const data = await dispatch(
      sessionActions.login({
        email: loginAsDemoUser ? "haolam@user.io" : email,
        password: loginAsDemoUser ? "password" : password,
      })
    );

    if (data?.errors) {
      enabledSubmitButton();
      if (data.errors.message) return setModalContent(<h2 className="subheading modal-errors">{data.errors.message}</h2>)
      return setErrors(data.errors);
    }
    setModalContent(<h2 className="subheading alert-success">Sucessfully Logged In</h2>)
  };

  const inputInvalid = () => {
    return (
      !email.length ||
      password.length < 6
    )
  }

  return (
    <>
      <h2 className="subheading">Log In</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="text"
          spellCheck={false}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        {errors.email && <p className="modal-errors">{errors.email}</p>}
        <label>Password</label>
        <input
          type="password"
          spellCheck={false}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {errors.password && <p className="modal-errors">{errors.password}</p>}
        <button
          type="submit"
          className={`btn-submit ${inputInvalid() ? 'disabled' : ''}`}
          disabled={inputInvalid()}
        >
          Submit
        </button>
        <p type="submit" onClick={e => handleSubmit(e, true)} className="demo-user">Login as demo user</p>
      </form>
    </>
  );
}

export default LoginFormModal;
