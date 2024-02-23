import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import ConfirmDeleteFormModal from "../ConfirmDeleteFormModal";
import * as workspaceActions from "../../redux/workspace";

function Memberships({ user, collapseWorkspaces, memberships, showUserProfile, showDirectMessages, getAvatarUrl }) {
  const { closeModal, setModalContent } = useModal();
  const dispatch = useDispatch();
  const [searchMembership, setSearchMembership] = useState("");
  const [currentMemberships, setCurrentMemberships] = useState([...memberships]);

  useEffect(() => {
    setCurrentMemberships([...memberships]);
  }, [memberships]);

  const isWorkspaceOwner = () => {
    const workspace = document.querySelector(".workspace.selected");
    if (!workspace) return false;
    const workspaceOwnerId = +workspace.dataset.workspaceOwnerId;
    return user?.id === workspaceOwnerId;
  }

  const deleteMember = async memberId => {
    const workspace = document.querySelector(".workspace.selected");
    if (!workspace) return;
    const data = await dispatch(workspaceActions.deleteMembershipThunk(+workspace.id, memberId));
    if (data?.errors) return setModalContent(<h2 className="subheading modal-errors">{data.errors.message}</h2>);
    setModalContent(<h2 className="subheading alert-success">Successfully Deleted Member</h2>);
  }

  const showDeleteMembershipModal = (e, memberId, email) => { // remove member from workspace
    e.stopPropagation();
    setModalContent(
      <ConfirmDeleteFormModal
        text="Are you sure you want to remove this member from the workspace?"
        deleteCb={() => {
          deleteMember(memberId);
          const removeUserIcon = document.querySelector(`[data-email="${email}"]`);
          console.log(removeUserIcon)
          if (!removeUserIcon) return;
          removeUserIcon.classList.remove("fa-user-xmark");
          removeUserIcon.classList.add("fa-ban");
          removeUserIcon.setAttribute("title", "User is no longer a member of this workspace. Old messages are being kept here.");
          removeUserIcon.addEventListener('click', e => e.stopPropagation());
        }}
        cancelDeleteCb={closeModal}
      />
    );
  }

  return (
    <div id="workspaces" className="direct-messages">
      <h2 className="subheading">
        <span>Direct Messages</span>
        <i className="fa-solid fa-square-minus" onClick={collapseWorkspaces} title="Minimize"></i>
      </h2>
      <div className="workspaces-list-wrapper">
        <div className="workspaces-list">
          {!memberships.length ? '' : <div className="searchbox-memberships">
            <input
              type="text"
              spellCheck={false}
              placeholder={`🔍 Search for memberships`}
              value={searchMembership}
              onChange={e => {
                setSearchMembership(e.target.value);
                if (e.target.value === "") return setCurrentMemberships(memberships);
                setCurrentMemberships(memberships.filter(membership => `${membership.first_name.toLowerCase()} ${membership.last_name.toLowerCase()}`.includes(e.target.value.toLowerCase())));
              }}
            />
          </div>}
          {currentMemberships.map(m => (
            <div
              id={m.id}
              key={m.id}
              className="workspace workspace-message"
              onClick={e => showDirectMessages(e, m.id, m.workspace_id)}
            >
              <div className="membership-details-wrapper">
                <div className="membership-image-name">
                  <img
                    onClick={e => showUserProfile(e, m)}
                    src={getAvatarUrl(m.profile_image_url)}
                    alt="avatar"
                  />
                  <span className="member-name" style={{ backgroundColor: 'transparent' }} >{m.first_name} {m.last_name}</span>
                </div>
                {m.id === user?.id ? (
                  <span className="member-icon-me me" title="Me" onClick={e => e.stopPropagation()}><i className="fa-solid fa-user"></i></span>
                ) : (
                  <span className="member-icon">
                    {m.removed ? (
                      <i
                        title="User is no longer a member of this workspace. Note that old messages are being preserved."
                        onClick={e => e.stopPropagation()}
                        className={`fa-solid fa-ban`}
                        dataset={m.email}
                      ></i>
                    ) : (
                      isWorkspaceOwner() && <i
                        onClick={e => showDeleteMembershipModal(e, m.id, m.email)}
                        className={`fa-solid fa-user-xmark`}
                        title="Remove this member"
                        data-email={m.email}
                      ></i>
                    )
                    }
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Memberships;
