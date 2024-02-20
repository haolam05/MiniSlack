function Messages({ user, messages, showMessageTime, getMessageAuthorImage, formattedDate, formattedTime, messageInput, setMessageInput }) {
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
            <div onClick={e => e.stopPropagation()} className={`hidden message-time ${m.sender_id === user.id ? 'me' : ''}`}>
              <div>{formattedDate(m.created_at)}</div>
              <div className="dot"><i className="fa-solid fa-circle"></i></div>
              <div>{formattedTime(m.created_at)}</div>
            </div>
          </div>
        ))}
      </div>
      <div id="message-input">
        <input
          type="text"
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
        />
      </div>
    </div>
  );
}

export default Messages;
