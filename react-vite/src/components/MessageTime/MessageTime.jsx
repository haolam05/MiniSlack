function MessageTime({ formattedDate, formattedTime, m }) {
  return (
    <>
      <div>{formattedDate(m.created_at)}</div>
      <div className="dot"><i className="fa-solid fa-circle"></i></div>
      <div>{formattedTime(m.created_at)}</div>
    </>
  );
}

export default MessageTime;
