import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { disabledSubmitButton, enabledSubmitButton } from "../../utils/dom";
import { useModal } from "../../context/Modal";
import { getInviteUsers } from "../../utils/user";
import * as workspaceActions from "../../redux/workspace";
import ConfirmDeleteFormModal from "../ConfirmDeleteFormModal";

function InviteMemberFormModal({ workspaceId, user }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [members, setMembers] = useState([]);
  const [errors, setErrors] = useState({});
  const { closeModal, setModalContent } = useModal();

  useEffect(() => {
    const loadMembers = async () => {
      const members = await getInviteUsers(workspaceId);
      if (!members.errors) {
        setMembers(members.filter(m => m.id !== user.id));
        if (members.length) setEmail(members[0].email);
      }
    }
    loadMembers();
  }, []);

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

  return (
    <div className="invite-member-container">
      <h2 className="subheading">Send Invitation</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Member emails</label>
        <select name="members" value={email} onChange={e => setEmail(e.target.value)}>
          {members.map(m => <option key={m.id} value={m.email}>{m.email}</option>)}
        </select>
        {errors.email && <p className="modal-errors">{errors.email}</p>}
        {errors.message && <p className="modal-errors">{errors.message}</p>}
        <button
          type="submit"
        // className={inputIsInvalid() ? "disabled" : ""}
        // disabled={inputIsInvalid()}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default InviteMemberFormModal;
