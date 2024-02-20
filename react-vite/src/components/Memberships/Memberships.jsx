function Memberships({ user, collapseWorkspaces, memberships, showUserProfile, showDirectMessages, getAvatarUrl }) {
  return (
    <div id="workspaces" className="direct-messages">
      <h2 className="subheading">
        <span>Direct Messages</span>
        <i onClick={collapseWorkspaces} className="fa-solid fa-window-maximize"></i>
      </h2>
      <div className="workspaces-list-wrapper">
        <div className="workspaces-list">
          {memberships.map(m => (
            <div
              id={m.id}
              key={m.id}
              className="workspace workspace-message"
              onClick={e => showDirectMessages(e, m.id)}
            >
              <img
                onClick={e => showUserProfile(e, m)}
                src={getAvatarUrl(m.profile_image_url)}
                alt="avatar"
              />
              <span className="member-name" style={{ backgroundColor: 'transparent' }} >{m.first_name} {m.last_name}</span>
              <span style={{ backgroundColor: 'transparent' }} className="me">{m.id === user.id && <i className="fa-solid fa-user"></i>}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Memberships;
