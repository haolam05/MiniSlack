import { useState } from "react"
import './CreateMessageForm.css'
import { disabledSubmitButton, enabledSubmitButton } from "../../utils/dom"
import { useDispatch } from "react-redux";
import { createMessageThunk } from "../../redux/message";

export const CreateMessage = () => {

    const [name, setName] = useState('');
    const [workspaceId, setWorkspaceId] = useState(0);
    const [isPrivate, setIsPrivate] = useState(false);
    const [receiverId, setReceiverId] = useState(0);
    const [channelId, setChannelId] = useState(0);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch()


    const handleSubmit = async (e) => {
        e.preventDefault();
        disabledSubmitButton();

        const payload = {}

        if (isPrivate) {
            payload = {
                message,
                workspace_id: workspaceId,
                is_private: isPrivate,
                receiver_id: receiverId,
            }
        } else {
            payload = {
                message,
                workspace_id: workspaceId,
                is_private: isPrivate,
                channel_id: channelId,
            }
        }



        const data = await dispatch(createMessageThunk(payload));

        if (data?.errors) {
            enabledSubmitButton();
            return setErrors(data.errors);
        }

    }

    const invalidInput = () => {
        return message.length < 1
    }

    return (
        <div id="create-message-form-container">
            <form
                onSubmit={e => handleSubmit(e)}
            >
                <input
                    type="text"
                    spellCheck={false}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Message"
                />
                <button
                    type="submit"
                    className={`btn-submit ${invalidInput() ? 'disabled' : ''}`}
                    disabled={invalidInput()}
                >Send</button>
            </form>
        </div>
    )
}
