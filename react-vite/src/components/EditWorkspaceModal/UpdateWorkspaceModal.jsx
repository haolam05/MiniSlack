import { useState } from "react";
import { useDispatch } from "react-redux";
import { editWorkspaceThunk } from "../../redux/workspace";
import { useModal } from "../../context/Modal";

const UpdatedWorkspaceModal = (workspace) => {

  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [name, setName] = useState(workspace.workspace.name);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newName = {name: name}
    const data = await dispatch(editWorkspaceThunk(workspace.workspace.id, newName));
    if (data?.errors) {
      setErrors(data.errors);
      return null;
    }
    closeModal();
  }

  if (!workspace) return;

  return (
    <>
      <h2>Change Workspace Name</h2>
      {errors && <p className="modal-errors">{errors.name}</p>}
      <form onSubmit={handleSubmit}>
        <div>Current Name: {workspace.workspace.name}</div>
        <label>New Name:</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button disabled={name?.length <4}>Submit</button>
      </form>
    </>
  )
}



export default UpdatedWorkspaceModal;
