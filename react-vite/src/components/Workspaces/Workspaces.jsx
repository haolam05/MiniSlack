import DeleteWorkspaceModal from "../EditWorkspaceModal/DeleteWorkspaceModal";
import UpdatedWorkspaceModal from "../EditWorkspaceModal/UpdateWorkspaceModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";

function Workspaces({ user, workspaces, collapseWorkspaces, showChannelsAndMemberships }) {
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
              <div className="workspace-details">
                <div>{w.name}</div>
                <div className={`workspace-btns${w.owner_id === user.id ? ' me' : ' hidden'}`}>
                  <div className="update-workspace-btn">
                    <OpenModalButton
                      buttonText={<i className="fa-solid fa-gear"></i>}
                      modalComponent={<UpdatedWorkspaceModal workspace={w} />}
                    />
                  </div>
                  <div className="delete-workspace-btn">
                    <OpenModalButton
                      buttonText={<i className="fa-solid fa-trash-can delete-workspace-btn"></i>}
                      // buttonId="delete-workspace-btn"
                      modalComponent={<DeleteWorkspaceModal workspaceId={w.id} />}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Workspaces;
