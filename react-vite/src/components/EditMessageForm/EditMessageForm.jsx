import { useEffect } from "react";

function EditMessageForm({ m, messageActions, dispatch, editMessageInput, setEditMessageInput }) {
  useEffect(() => {
    setEditMessageInput(m.message);
  }, [m, setEditMessageInput]);

  const handleSubmit = async e => {
    e.preventDefault();

    const messageId = +e.target.closest(".message")?.id || null;
    const userReceiver = document.querySelector(".workspace-message.selected");
    const channelReceiver = document.querySelector(".workspace-channel.selected");
    const workspace = document.querySelector(".workspace.selected");
    const form = e.target.parentElement.closest(".edit-message-form");
    const messageDetails = e.target.closest(".message-details").querySelector('div');

    if (!userReceiver && !channelReceiver) return;
    if (!workspace || !editMessageInput.length) return;

    let payload;

    if (userReceiver) {
      payload = {
        message: editMessageInput,
        is_private: true,
        workspace_id: +workspace.id,
        receiver_id: +userReceiver.id
      }
    } else {
      payload = {
        message: editMessageInput,
        is_private: false,
        workspace_id: +workspace.id,
        channel_id: +channelReceiver.id
      }
    }
    const data = await dispatch(messageActions.updateMessageThunk(messageId, payload));
    if (data?.errors) return;
    form.classList.add("hidden");
    messageDetails.classList.remove("hidden");
    messageDetails.textContent = editMessageInput;
  }

  return (
    <form onClick={e => e.stopPropagation()} className="edit-message-form hidden">
      <textarea
        spellCheck="false"
        className="edit-message-textarea"
        value={editMessageInput}
        onChange={(e => setEditMessageInput(e.target.value))}
      ></textarea>
      <i onClick={handleSubmit} className="fa-regular fa-paper-plane" title="Save"></i>
    </form>
  );
}

export default EditMessageForm;
