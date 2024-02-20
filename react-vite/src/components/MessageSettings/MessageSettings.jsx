import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import ConfirmDeleteFormModal from "../ConfirmDeleteFormModal";
import * as messageActions from "../../redux/message";

function MessageSettings() {
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal();

  const updateMessage = () => {

  }

  const deleteMessage = async (e, messageId) => {
    const data = await dispatch(messageActions.deleteMessageThunk(messageId));
    if (data?.errors) return;
    e.target.closest(".message.me")?.remove();
    closeModal();
  }

  const openDeleteMessageform = e => {
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
      <span onClick={updateMessage}><i className="fa-solid fa-gear"></i></span>
      <span onClick={openDeleteMessageform}><i className="fa-solid fa-trash-can"></i></span>
    </div>
  );
}

export default MessageSettings;
