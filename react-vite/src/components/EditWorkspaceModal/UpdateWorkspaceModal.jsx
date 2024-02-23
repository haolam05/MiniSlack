import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { disabledSubmitButton, enabledSubmitButton } from "../../utils/dom";
import * as workspaceActions from "../../redux/workspace";

const UpdatedWorkspaceModal = workspace => {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const [name, setName] = useState(workspace.workspace.name);
  const [errors, setErrors] = useState({});

  const handleSubmit = async e => {
    e.preventDefault();
    disabledSubmitButton();

    const newName = { name: name }

    const data = await dispatch(workspaceActions.editWorkspaceThunk(workspace.workspace.id, newName));
    if (data?.errors) {
      enabledSubmitButton();
      return setErrors(data.errors);
    }
    setModalContent(<h2 className="subheading alert-success">Successfully updated</h2>)
  }

  if (!workspace) return;

  return (
    <>
      <h2 className="workspace-edit-form-header">
        <div className="subheading">Edit Workspace</div>
        <p className="caption">{workspace.workspace?.name}</p>
      </h2>
      <form className="edit-workspace-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          value={name}
          placeholder="At least 4 characters"
          spellCheck={false}
          onChange={e => setName(e.target.value)}
        />
        {errors && <p className="modal-errors">{errors.name}</p>}
        <button
          type="submit"
          disabled={name?.length < 4}
          className={name?.length < 4 ? "disabled" : ""}
        >
          Submit
        </button>
      </form>
    </>
  )
}

export default UpdatedWorkspaceModal;
