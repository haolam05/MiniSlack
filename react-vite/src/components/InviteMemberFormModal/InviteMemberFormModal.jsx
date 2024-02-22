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

    const payload = { email };
    const data = await dispatch(workspaceActions.createMembershipThunk(workspaceId, payload));
    console.log(data, '🐷🐷🐷🐷');
    if (data?.errors) {
      enabledSubmitButton();
      return setErrors(data.errors);
    }
    setModalContent(<h2 className="subheading alert-success">Successfully Sent Invitation</h2>);
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
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        {errors.email && <p className="modal-errors">{errors.email}</p>}
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
