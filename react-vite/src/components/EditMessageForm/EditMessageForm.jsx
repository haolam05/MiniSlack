import { useState } from "react";

function EditMessageForm({ m, messageActions, dispatch }) {
  const [messageInput, setMessageInput] = useState(m.message);

  const handleSubmit = async e => {
    e.preventDefault();

    const messageId = +e.target.closest(".message")?.id || null;
    const messageInput = e.target.parentElement.querySelector("textarea")?.textContent || "";
    const userReceiver = document.querySelector(".workspace-message.selected");
    const channelReceiver = document.querySelector(".workspace-channel.selected");
    const workspace = document.querySelector(".workspace.selected");
    const form = e.target.parentElement.closest(".edit-message-form");
    const messageDetails = e.target.closest(".message-details").querySelector('div');

    if (!userReceiver && !channelReceiver) return;
    if (!workspace || !messageInput.length) return;

    let payload;

    if (userReceiver) {
      payload = {
        message: messageInput,
        is_private: true,
        workspace_id: +workspace.id,
        receiver_id: +userReceiver.id
      }
    } else {
      payload = {
        message: messageInput,
        is_private: false,
        workspace_id: +workspace.id,
        channel_id: +channelReceiver.id
      }
    }
    await dispatch(messageActions.updateMessageThunk(messageId, payload));
    form.classList.add("hidden");
    messageDetails.classList.remove("hidden");
    messageDetails.textContent = messageInput;
  }

  return (
    <form onClick={e => e.stopPropagation()} className="edit-message-form hidden">
      <textarea
        spellCheck="false"
        className="edit-message-textarea"
        value={messageInput}
        onChange={(e => setMessageInput(e.target.value))}
      ></textarea>
      <i onClick={handleSubmit} className="fa-regular fa-paper-plane"></i>
    </form>
  );
}

export default EditMessageForm;
