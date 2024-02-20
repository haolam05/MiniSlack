function Channels({ collapseWorkspaces, channels, showChannelMessages }) {
  return (
    <div id="workspaces" className="channels">
      <h2 className="subheading">
        <span>Channels</span>
        <i onClick={collapseWorkspaces} className="fa-solid fa-window-maximize"></i>
      </h2>
      <div className="workspaces-list-wrapper">
        <div className="workspaces-list">
          {channels.map(c => (
            <div
              id={c.id}
              key={c.id}
              className="workspace workspace-channel"
              onClick={showChannelMessages}
            >
              {c.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Channels;
