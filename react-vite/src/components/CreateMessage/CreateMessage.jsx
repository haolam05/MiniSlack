import { useState } from "react"
import './CreateMessage.css'

export const CreateMessage = () => {

    const [name, setName] = useState('')
    const [workspaceId, setWorkspaceId] = useState(0)
    const [isPrivate, setIsPrivate] = useState(false)
    const [receiverId, setReceiverId] = useState(0)
    const [channelId, setChannelId] = useState(0)

    console.log(isPrivate)

    const submitForm = async(e) => {
        e.preventDefault()

        const payload = {
            name,
            workspaceId,
            isPrivate,
            receiverId,
            channelId
        }
        console.log(payload)
    }

    return (
        <div id="create-message-form-container">
            <form
            onSubmit={e => submitForm(e)}
            >
                <label>
                    name
                    <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    >
                    </input>
                </label>
                <label>
                    workspace id
                    <input
                    type="number"
                    value={workspaceId}
                    onChange={e => setWorkspaceId(e.target.value)}
                    >
                    </input>
                </label>
                <label>
                    is private
                    <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={e => setIsPrivate(e.target.checked)}
                    >
                    </input>
                </label>
                <label>
                    receiver id
                    <input
                    type="number"
                    value={receiverId}
                    onChange={e => setReceiverId(e.target.value)}
                    >
                    </input>
                </label>
                <label>
                    channel id
                    <input
                    type="number"
                    value={channelId}
                    onChange={e => setChannelId(e.target.value)}
                    >
                    </input>
                </label>
                <button
                type="submit"
                >
                    Create Channel
                </button>
            </form>

        </div>
    )
}