import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import ConfirmDeleteFormModal from "../ConfirmDeleteFormModal";
import UpdatedWorkspaceModal from "../EditWorkspaceModal/UpdateWorkspaceModal";
import OpenModalButton from "../OpenModalButton";
import WorkspaceFormModal from "../WorkspaceFormModal";
import InviteMemberFormModal from "../InviteMemberFormModal";
import * as workspaceActions from "../../redux/workspace";

function Workspaces({ user, workspaces, collapseWorkspaces, showChannelsAndMemberships }) {
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal();

  const deleteWorkspace = async (_e, workspaceId) => {
    await dispatch(workspaceActions.deleteWorkspaceThunk(workspaceId));
    setModalContent(<h2 className="subheading alert-success">Successfully deleted</h2>)
  }

  const createWorkspace = () => {
    setModalContent(<WorkspaceFormModal />)
  }

  const inviteMember = workspaceId => {
    setModalContent(<InviteMemberFormModal workspaceId={workspaceId} />)
  }

  const leaveWorkspace = async workspaceId => {
    const data = await dispatch(workspaceActions.leaveMembershipThunk(workspaceId, user.id));
    if (data?.errors) return setModalContent(<h2 className="subheading modal-errors">{data.errors.message}</h2>);
    setModalContent(<h2 className="subheading alert-success">Successfully Leaved Workspace</h2>);
  }

  const showDeleteMembershipModal = workspaceId => { // user leaves workspace
    setModalContent(
      <ConfirmDeleteFormModal
        text="Are you sure you want to leave this workspace?"
        deleteCb={() => leaveWorkspace(workspaceId)}
        cancelDeleteCb={closeModal}
      />
    );
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
                {w.owner_id === user.id ? (
                  <div className={`workspace-btns${w.owner_id === user.id ? ' me' : ' hidden'}`} onClick={e => e.stopPropagation()}>
                    <div className="invite-member" onClick={() => inviteMember(w.id)}>
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
                ) : (
                  <div className={`workspace-btns`} onClick={e => e.stopPropagation()}>
                    <div className="delete-member" onClick={() => showDeleteMembershipModal(w.id)}>
                      <i className="fa-solid fa-person-walking-arrow-right"></i>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Workspaces;
