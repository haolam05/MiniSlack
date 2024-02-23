import { useState } from "react";
import { useDispatch } from "react-redux";
import { disabledSubmitButton, enabledSubmitButton } from "../../utils/dom";
import { useModal } from "../../context/Modal";
import * as workspaceActions from "../../redux/workspace";
import ConfirmDeleteFormModal from "../ConfirmDeleteFormModal";

function InviteMemberFormModal({ workspaceId }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal, setModalContent } = useModal();

  const deleteMember = async memberId => {
    const workspace = document.querySelector(".workspace.selected");
    if (!workspace) return;
    const data = await dispatch(workspaceActions.deleteMembershipThunk(+workspace.id, memberId));
    if (data?.errors) return setModalContent(<h2 className="subheading modal-errors">{data.errors.message}</h2>);
    setModalContent(<h2 className="subheading alert-success">Successfully Deleted Member</h2>);
  }

  const showDeleteMembershipModal = (e, memberId, email) => { // remove member from workspace
    e.stopPropagation();
    setModalContent(
      <ConfirmDeleteFormModal
        text="Are you sure you want to remove this member from the workspace?"
        deleteCb={() => {
          deleteMember(memberId);
          const removeUserIcon = document.querySelector(`[data-email="${email}"]`);
          console.log(removeUserIcon)
          if (!removeUserIcon) return;
          removeUserIcon.classList.remove("fa-user-xmark");
          removeUserIcon.classList.add("fa-ban");
          removeUserIcon.setAttribute("title", "User is no longer a member of this workspace. Old messages are being kept here.");
          removeUserIcon.addEventListener('click', e => e.stopPropagation());
        }}
        cancelDeleteCb={closeModal}
      />
    );
  }


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

    // Update previously deleted member back to member
    const removeUserIcon = document.querySelector(`[data-email="${email}"]`);
    if (!removeUserIcon) return
    const member = removeUserIcon.closest(".workspace-message");
    if (!member) return
    removeUserIcon.classList.remove("fa-ban");
    removeUserIcon.classList.add("fa-user-xmark");
    removeUserIcon.setAttribute("title", "");
    removeUserIcon.addEventListener('click', e => showDeleteMembershipModal(e, +member.id, email));
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
