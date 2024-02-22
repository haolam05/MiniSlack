import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { disabledSubmitButton, enabledSubmitButton } from "../../utils/dom";
import { createReactionApi, deleteReactionApi } from "../../utils/reactions";
import MessageTime from "../MessageTime";
import MessageSettings from "../MessageSettings";
import EditMessageForm from "../EditMessageForm";
import EmojisList from "../EmojsList";
import * as messageActions from "../../redux/message";

function Messages({ user, messages, showMessageTime, getMessageAuthorImage, formattedDate, formattedTime, messageInput, setMessageInput, scrollToNewMessage, editMessageInput, setEditMessageInput, emojis, getMessageAuthorName }) {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();

  const disabledInputMessage = () => {
    if (user && user.user === null) {
      setMessageInput("");
      return true;
    }
    const userReceiver = document.querySelector(".workspace-message.selected");
    const channelReceiver = document.querySelector(".workspace-channel.selected");
    const workspace = document.querySelector(".workspace.selected");
    if (!workspace || (!userReceiver && !channelReceiver)) {
      setMessageInput("");
      return true;
    }
    return false;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    disabledSubmitButton();

    const userReceiver = document.querySelector(".workspace-message.selected");
    const channelReceiver = document.querySelector(".workspace-channel.selected");
    const workspace = document.querySelector(".workspace.selected");

    if (!userReceiver && !channelReceiver) return enabledSubmitButton();
    if (!workspace || !messageInput.length) return enabledSubmitButton();

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

    const data = await dispatch(messageActions.createMessageThunk(payload));
    if (data?.errors) {
      enabledSubmitButton();
      return setModalContent(<h2 className="subheading modal-errors">User is no longer a member of the workspace</h2>)
    }
    setMessageInput("");
    scrollToNewMessage();
    enabledSubmitButton();
  }

  const showEmojisList = async e => {
    e.stopPropagation();
    if (!disabledInputMessage()) {
      document.querySelector(".emojis-list").classList.remove("hidden");
    }
  }

  const hideEmojisList = e => {
    if (!e.target.closest(".emojis-list")) {
      document.querySelector(".emojis-list").classList.add("hidden");
    }
  }

  const createReaction = async (reactionEl, m, reaction) => {
    const data = await createReactionApi(m.id, String.fromCodePoint(reaction));
    if (data?.errors) return;
    const reactionId = data.id;
    const messaegId = data.message_id;
    const userId = data.user_id;
    reactionEl.addEventListener("click", e2 => deleteReaction(e2, messaegId, userId, reactionId));
  }

  const deleteReaction = async (e, messageId, ownerId, reactionId) => {
    e.stopPropagation();
    if (ownerId === user.id) {
      e.target.remove();
      await deleteReactionApi(messageId, reactionId);
    }
  }

  function ShowReactions({ m }) {
    if (m.reactions && m.reactions.length) {
      return m.reactions.map(r => {
        return <div
          onClick={e => deleteReaction(e, m.id, r.user_id, r.id)}
          key={r.id}
          className={`reaction${r.user_id === user.id ? '' : ' not-me'}`}
        >
          {r.encoded_text}
        </div>
      })
    }
  }

  return (
    <div className="messages-wrapper">
      <div className="messages-details-wrapper" onClick={hideEmojisList}>
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
                  <EditMessageForm
                    m={m}
                    messageActions={messageActions}
                    dispatch={dispatch}
                    editMessageInput={editMessageInput}
                    setEditMessageInput={setEditMessageInput}
                  />
                  <div className="message-image"><img src={getMessageAuthorImage(m)} alt="avatar" /></div>
                </>
              ) : (
                <>
                  <div className="message-image" title={getMessageAuthorName(m)}><img src={getMessageAuthorImage(m)} alt="avatar" /></div>
                  <div>{m.message}</div>
                </>
              )}
            </div>
            {m.sender_id === user.id ? (
              <div onClick={e => e.stopPropagation()} className={`hidden message-time ${m.sender_id === user.id ? 'me' : ''}`}>
                <MessageTime formattedDate={formattedDate} formattedTime={formattedTime} m={m} emojis={emojis} createReaction={createReaction} />
                <MessageSettings setEditMessageInput={setEditMessageInput} />
              </div>
            ) : (
              <div onClick={e => e.stopPropagation()} className={`hidden message-time ${m.sender_id === user.id ? 'me' : ''}`}>
                <MessageTime formattedDate={formattedDate} formattedTime={formattedTime} m={m} emojis={emojis} createReaction={createReaction} />
              </div>
            )}
            <div className="reactions"><ShowReactions m={m} /></div>
          </div>
        ))}
      </div>
      <div id="message-input" onClick={hideEmojisList}>
        <form onSubmit={handleSubmit} id="create-message-form">
          <textarea
            spellCheck="false"
            value={messageInput}
            disabled={disabledInputMessage()}
            onChange={e => setMessageInput(e.target.value)}
          />
          <div className="emojis">
            <i onClick={showEmojisList} className={`fa-solid fa-face-smile${disabledInputMessage() ? " disabled" : ""}`}>
            </i>
          </div>
          <button
            disabled={disabledInputMessage()}
            type="submit"
            className={disabledInputMessage() ? "disabled" : ""}
          >
            <i className="fa-regular fa-paper-plane">
            </i>
          </button>
        </form>
      </div>
      <EmojisList emojis={emojis} setMessageInput={setMessageInput} />
    </div>
  );
}

export default Messages;
