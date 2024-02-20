import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import ConfirmDeleteFormModal from "../ConfirmDeleteFormModal";
import * as messageActions from "../../redux/message";

function MessageSettings({ setEditMessageInput }) {
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal();

  const openUpdateMessageForm = e => {
    const message = e.target.closest(".message");
    if (!message) return;
    const messageDetails = message.querySelector(".message-details>div");
    const form = message.querySelector(".edit-message-form");

    const allEditForms = document.querySelectorAll(".message .edit-message-form");
    for (let i = 0; i < allEditForms.length; i++) {
      if (!allEditForms[i].classList.contains("hidden")) return;
    }
    messageDetails.classList.add("hidden");
    form.classList.remove("hidden");
    setEditMessageInput(messageDetails.textContent);
  }

  const deleteMessage = async (e, messageId) => {
    const data = await dispatch(messageActions.deleteMessageThunk(messageId));
    if (data?.errors) return;
    const message = e.target.closest(".message.me");
    if (message) message.classList.add("hidden");
    closeModal();
  }

  const openDeleteMessageForm = e => {
    const message = e.target.closest(".message");
    if (!message) return;
    const messageId = +message.id;

    setModalContent(
      <ConfirmDeleteFormModal
        text="Are you sure you want to delete this message?"
        deleteCb={() => deleteMessage(e, messageId)}
        cancelDeleteCb={closeModal}
      />
    );
  }

  return (
    <div className="message-settings">
      <span onClick={openUpdateMessageForm}><i className="fa-solid fa-gear"></i></span>
      <span onClick={openDeleteMessageForm}><i className="fa-solid fa-trash-can"></i></span>
    </div>
  );
}

export default MessageSettings;
