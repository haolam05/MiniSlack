function ShowReactions({ m, deleteReaction, user }) {
  if (m.reactions && m.reactions.length) {
    return m.reactions.map(r => {
      return <div
        onClick={e => deleteReaction(e, m.id, r.user_id, r.id)}
        title={`${r.user.first_name} ${r.user.last_name}`}
        key={r.id}
        className={`reaction${r.user_id === user?.id ? '' : ' not-me'}`}
        id={`reaction-${r.id}`}
      >
        {r.encoded_text}
      </div>
    })
  }
}

export default ShowReactions;
