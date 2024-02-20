import { useDispatch } from "react-redux";
import { disabledSubmitButton, enabledSubmitButton } from "../../utils/dom";
import * as messageActions from "../../redux/message";

function Messages({ user, messages, showMessageTime, getMessageAuthorImage, formattedDate, formattedTime, messageInput, setMessageInput }) {
  const dispatch = useDispatch();

  const scrollToNewMessage = () => {
    const chatWindow = document.querySelector(".messages-details-wrapper");
    if (chatWindow && chatWindow.clientHeight + chatWindow.scrollTop + 79 === chatWindow.scrollHeight) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }

  const disabledInputMessage = () => {
    if (user && user.user === null) return true;
    const userReceiver = document.querySelector(".workspace-message.selected");
    const channelReceiver = document.querySelector(".workspace-channel.selected");
    const workspace = document.querySelector(".workspace.selected");
    if (!workspace) return true;
    if (!userReceiver && !channelReceiver) return true;
    return false;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    disabledSubmitButton();

    const userReceiver = document.querySelector(".workspace-message.selected");
    const channelReceiver = document.querySelector(".workspace-channel.selected");
    const workspace = document.querySelector(".workspace.selected");

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

    await dispatch(messageActions.createMessageThunk(payload));
    setMessageInput("");
    scrollToNewMessage();
    enabledSubmitButton();
  }

  return (
    <div className="messages-wrapper">
      <div className="messages-details-wrapper">
        <div className="message-header"></div>
        {messages.map(m => (
          <div
            id={m.id}
            key={m.id}
            className={`message ${m.sender_id === user.id ? 'me' : ''}`}
            onClick={showMessageTime}
          >
            <div className="message-details">
              {m.sender_id === user.id ? (
                <>
                  <div>{m.message}</div>
                  <div className="message-image"><img src={getMessageAuthorImage(m)} alt="avatar" /></div>
                </>
              ) : (
                <>
                  <div className="message-image"><img src={getMessageAuthorImage(m)} alt="avatar" /></div>
                  <div>{m.message}</div>
                </>
              )}
            </div>
            {m.sender_id === user.id ? (
              <div onClick={e => e.stopPropagation()} className={`hidden message-time ${m.sender_id === user.id ? 'me' : ''}`}>
                <div>{formattedDate(m.created_at)}</div>
                <div className="dot"><i className="fa-solid fa-circle"></i></div>
                <div>{formattedTime(m.created_at)}</div>
                <div className="message-settings"><span><i className="fa-solid fa-gear"></i></span><span><i className="fa-solid fa-trash-can"></i></span></div>
              </div>
            ) : (
              <div onClick={e => e.stopPropagation()} className={`hidden message-time ${m.sender_id === user.id ? 'me' : ''}`}>
                <div className="message-settings"><span><i className="fa-solid fa-gear"></i></span><span><i className="fa-solid fa-trash-can"></i></span></div>
                <div>{formattedDate(m.created_at)}</div>
                <div className="dot"><i className="fa-solid fa-circle"></i></div>
                <div>{formattedTime(m.created_at)}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div id="message-input">
        <form onSubmit={handleSubmit}>
          <textarea
            value={messageInput}
            disabled={disabledInputMessage()}
            onChange={e => setMessageInput(e.target.value)}
          />
          <button disabled={disabledInputMessage()} type="submit"><i className="fa-regular fa-paper-plane"></i></button>
        </form>
      </div>
    </div>
  );
}

export default Messages;
