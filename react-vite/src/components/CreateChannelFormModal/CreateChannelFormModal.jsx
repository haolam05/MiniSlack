import { useState } from "react"
import "./CreateChannelFormModal.css"
import { disabledSubmitButton, enabledSubmitButton } from "../../utils/dom"
import { useDispatch } from "react-redux";
import { addChannelsThunk } from "../../redux/channel";
import { useModal } from "../../context/Modal";

const CreateChannelFormModal = () => {
    const { setModalContent } = useModal();

    const [name, setName] = useState('');
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        disabledSubmitButton();

        const channel = {
            name,
            topic,
            description
        }

        const data = await dispatch(addChannelsThunk( 1, channel));

        if (data?.errors) {
            enabledSubmitButton();
            return setErrors(data.errors);
        }

        setModalContent(<h2 className="subheading alert-success">Successfully Create a Channel</h2>);

    }

    const invalidInput = () => {
        return name.length < 4
    }

    return (
        <div id="create-channel-form-container">
            <form onSubmit={e => handleSubmit(e)} >
                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
                {errors.name && <p className="modal-errors">{errors.name}</p>}
                <label>Topic</label>
                <input
                    type="text"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                />
                <label>Description</label>
                <input
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <button
                    type="submit"
                    className={`btn-submit ${invalidInput() ? 'disabled' : ''}`}
                    disabled={invalidInput()}
                >
                    Create Channel
                </button>
            </form>
        </div>
    )
}

export default CreateChannelFormModal;
