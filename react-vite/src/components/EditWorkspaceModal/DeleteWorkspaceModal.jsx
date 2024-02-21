import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteWorkspaceThunk } from "../../redux/workspace";
import "./EditWorkspaceModal.css"

export default function DeleteWorkspaceModal({ workspaceId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const submitDelete = async() => {
    const data = await dispatch(deleteWorkspaceThunk(workspaceId));
    if (data?.errors) return;
    closeModal();
  }

  return (
    <div id='delete-workspace-modal-container' >
      <h1>Confirm Delete</h1>
      <p>Are you sure to delete this workspace?</p>
      <button id='yes-delete-workspace' onClick={submitDelete}>Yes (Delete Workspace)</button>
      <button id='no-keep-workspace' onClick={closeModal}>No (Keep Workspace)</button>
    </div>
  )
}
