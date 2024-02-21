import DeleteWorkspaceModal from "../EditWorkspaceModal/DeleteWorkspaceModal";
import UpdatedWorkspaceModal from "../EditWorkspaceModal/UpdateWorkspaceModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";

function Workspaces({ workspaces, collapseWorkspaces, showChannelsAndMemberships, }) {
  return (
    <div id="workspaces">
      <h2 className="subheading">
        <span>Workspaces</span>
        <i onClick={collapseWorkspaces} className="fa-solid fa-window-maximize"></i>
      </h2>
      <div className="workspaces-list-wrapper">
        <div className="workspaces-list">
          {workspaces.map(w => (<>
            <div
              id={w.id}
              key={w.id}
              className="workspace"
              onClick={showChannelsAndMemberships}
            >
              {w.name}
            </div>
            <div>
              <OpenModalButton
                buttonText={<i className="fa-solid fa-gear"></i>}
                modalComponent={<UpdatedWorkspaceModal workspace={w} />}
              />
            </div>
            <div>
              <OpenModalButton
                buttonText={<i className="fa-solid fa-trash-can delete-workspace-btn"></i>}
                // buttonId="delete-workspace-btn"
                modalComponent={<DeleteWorkspaceModal workspaceId={w.id} />}
              />
            </div>
            </>))}
        </div>
      </div>
    </div>
  );
}

export default Workspaces;
