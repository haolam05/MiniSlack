import { useState } from "react";
import { useDispatch } from "react-redux";
import { disabledSubmitButton, enabledSubmitButton } from "../../utils/dom";
import { useModal } from "../../context/Modal";
import * as workspaceActions from "../../redux/workspace";

function InviteMemberFormModal({ workspaceId }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const { setModalContent } = useModal();

  const handleSubmit = async e => {
    e.preventDefault();
    disabledSubmitButton();

    const selectedWorkspace = document.querySelector(".workspace.selected");
    const addToReduxStore = +selectedWorkspace?.id === workspaceId;

    const payload = { email };
    const data = await dispatch(workspaceActions.createMembershipThunk(workspaceId, payload, addToReduxStore));

    if (data?.errors) {
      return setErrors(data.errors);
    }
    enabledSubmitButton();
    setModalContent(<h2 className="subheading alert-success">Succfessully Sent Invitation</h2>);
  };

  const inputIsInvalid = () => {
    return (
      !email.length ||
      !email.includes('@') ||
      !email.includes('.')
    );
  }

  return (
    <div className="invite-member-container">
      <h2 className="subheading">Send Invitation</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          value={email}
          spellCheck={false}
          placeholder="example@user.io"
          onChange={e => setEmail(e.target.value)}
        />
        {errors.email && <p className="modal-errors">{errors.email}</p>}
        {errors.message && <p className="modal-errors">{errors.message}</p>}
        <button
          type="submit"
          className={inputIsInvalid() ? "disabled" : ""}
          disabled={inputIsInvalid()}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default InviteMemberFormModal;
