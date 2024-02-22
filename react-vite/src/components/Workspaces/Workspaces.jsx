import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import ConfirmDeleteFormModal from "../ConfirmDeleteFormModal";
import UpdatedWorkspaceModal from "../EditWorkspaceModal/UpdateWorkspaceModal";
import OpenModalButton from "../OpenModalButton";
import WorkspaceFormModal from "../WorkspaceFormModal";
import * as workspaceActions from "../../redux/workspace";

function Workspaces({ user, workspaces, collapseWorkspaces, showChannelsAndMemberships }) {
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal();

  const deleteWorkspace = async (_e, workspaceId) => {
    await dispatch(workspaceActions.deleteWorkspaceThunk(workspaceId));
    setModalContent(<h2 className="subheading alert-success">Successfully deleted</h2>)
  }

  const createWorkspace = async () => {
    await setModalContent(<WorkspaceFormModal />)
  }

  return (
    <div id="workspaces">
      <h2 className="subheading">
        <span>Workspaces</span>
        <i className="fa-solid fa-square-minus" onClick={collapseWorkspaces}></i>
        {user?.user !== null && <i className="fa-solid fa-square-plus" onClick={createWorkspace} ></i>}
      </h2>
      <div className="workspaces-list-wrapper">
        <div className="workspaces-list">
          {workspaces.map(w => (
            <div
              id={w.id}
              data-workspace-owner-id={w.owner_id}
              key={w.id}
              className="workspace"
              onClick={showChannelsAndMemberships}
            >
              <div className="workspace-details">
                <div>{w.name}</div>
                <div className={`workspace-btns${w.owner_id === user.id ? ' me' : ' hidden'}`} onClick={e => e.stopPropagation()}>
                  <div className="invite-member">
                    <i className="fa-solid fa-share-from-square"></i>
                  </div>
                  <div className="update-workspace-btn">
                    <OpenModalButton
                      buttonText={<i className="fa-solid fa-gear"></i>}
                      modalComponent={<UpdatedWorkspaceModal workspace={w} />}
                    />
                  </div>
                  <div className="delete-workspace-btn">
                    <OpenModalButton
                      buttonText={<i className="fa-solid fa-trash-can delete-workspace-btn"></i>}
                      modalComponent={
                        <ConfirmDeleteFormModal
                          text="Are you sure you want to delete this workspace?"
                          deleteCb={e => deleteWorkspace(e, w.id)}
                          cancelDeleteCb={closeModal}
                        />
                      }
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
