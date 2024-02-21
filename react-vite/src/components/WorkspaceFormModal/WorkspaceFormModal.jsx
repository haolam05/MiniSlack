import { useState } from "react"
import { disabledSubmitButton, enabledSubmitButton } from "../../utils/dom";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import * as workspaceActions from "../../redux/workspace";

const WorkspaceFormModal = () => {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async e => {
    e.preventDefault();
    disabledSubmitButton();

    const data = await dispatch(workspaceActions.createWorkspaceThunk({ name }));

    if (data?.errors) {
      enabledSubmitButton();
      return setErrors(data.errors);
    }

    setModalContent(<h2 className="subheading alert-success">Successfully Created</h2>);
  }


  return (<>
    <h2 className="subheading">New Workspace</h2>
    <form className="create-workspace-form" onSubmit={handleSubmit}>
      <label>Name</label>
      <input
        type="text"
        spellCheck={false}
        value={name}
        onChange={e => setName(e.target.value)}
      />
      {errors && <p className="modal-errors">{errors.name}</p>}
      <button
        type="submit"
        className={name.length < 4 ? "disabled" : ""}
        disabled={name.length < 4}
      >
        Submit
      </button>
    </form>
  </>)
}

export default WorkspaceFormModal;
