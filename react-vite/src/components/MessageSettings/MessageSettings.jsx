import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import ConfirmDeleteFormModal from "../ConfirmDeleteFormModal";
import * as messageActions from "../../redux/message";

function MessageSettings() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const updateMessage = () => {

  }

  const deleteMessage = async () => {
    await dispatch(messageActions.deleteMessage);
  }

  const openDeleteMessageform = () => {
    <ConfirmDeleteFormModal
      text="Are you sure you want to delete this message?"
      deleteCb={deleteMessage}
      cancelDeleteCb={closeModal}
    />
  }

  return (
    <div className="message-settings">
      <span onClick={updateMessage}><i className="fa-solid fa-gear"></i></span>
      <span onClick={deleteMessage}><i className="fa-solid fa-trash-can"></i></span>
    </div>
  );
}

export default MessageSettings;
