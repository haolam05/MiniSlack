import { useState } from "react"
import { disabledSubmitButton, enabledSubmitButton } from "../../utils/dom";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import * as channelActions from "../../redux/channel";

function ChannelFormModal() {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async e => {
    e.preventDefault();
    disabledSubmitButton();

    const workspace = document.querySelector(".workspace.selected");
    if (!workspace) return;

    const payload = {
      name,
      topic,
      description
    }

    const data = await dispatch(channelActions.createChannelThunk(+workspace.id, payload));

    if (data?.errors) {
      enabledSubmitButton();
      return setErrors(data.errors);
    }

    setModalContent(<h2 className="subheading alert-success">Successfully Created</h2>);
  }


  return (<>
    <h2 className="subheading">New Channel</h2>
    <form className="create-channel-form" onSubmit={handleSubmit}>
      <label>Name</label>
      <input
        type="text"
        spellCheck={false}
        value={name}
        onChange={e => setName(e.target.value)}
      />
      {errors && <p className="modal-errors">{errors.name}</p>}
      <label>Topic</label>
      <input
        type="text"
        spellCheck={false}
        value={topic}
        onChange={e => setTopic(e.target.value)}
      />
      {errors && <p className="modal-errors">{errors.topic}</p>}
      <label>Description</label>
      <input
        type="text"
        spellCheck={false}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      {errors && <p className="modal-errors">{errors.description}</p>}
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

export default ChannelFormModal;
