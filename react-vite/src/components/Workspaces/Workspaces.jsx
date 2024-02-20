function Workspaces({ workspaces, collapseWorkspaces, showChannelsAndMemberships, }) {
  return (
    <div id="workspaces">
      <h2 className="subheading">
        <span>Workspaces</span>
        <i onClick={collapseWorkspaces} className="fa-solid fa-window-maximize"></i>
      </h2>
      <div className="workspaces-list-wrapper">
        <div className="workspaces-list">
          {workspaces.map(w => (
            <div
              id={w.id}
              key={w.id}
              className="workspace"
              onClick={showChannelsAndMemberships}
            >
              {w.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Workspaces;
