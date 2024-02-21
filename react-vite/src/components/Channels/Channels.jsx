import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import ConfirmDeleteFormModal from "../ConfirmDeleteFormModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import UpdatedChannelModal from "../UpdateChannelModal";
import ChannelFormModal from "../ChannelFormModal";
import * as channelActions from "../../redux/channel";

function Channels({ user, collapseWorkspaces, channels, showChannelMessages }) {
  const dispatch = useDispatch();
  const { closeModal, setModalContent } = useModal()

  const deleteChannel = async (_e, channelId) => {
    const channel = document.querySelector(`.channel-${channelId}`);
    if (!channel) return;

    await dispatch(channelActions.deleteChannelThunk(channelId));
    setModalContent(<h2 className="subheading alert-success">Successfully deleted</h2>)
    channel.remove();
    const header = document.querySelector(".message-header");
    if (header) header.textContent = "";
  }

  const createChannel = async () => {
    await setModalContent(<ChannelFormModal />);
    const currentDm = document.querySelector(".workspace-message.selected");
    if (currentDm) currentDm.classList.remove("selected");
  }

  return (
    <div id="workspaces" className="channels">
      <h2 className="subheading">
        <span>Channels</span>
        <i className="fa-solid fa-square-minus" onClick={collapseWorkspaces}></i>
        {user?.user !== null && <i className="fa-solid fa-square-plus" onClick={createChannel} ></i>}
      </h2>
      <div className="workspaces-list-wrapper">
        <div className="workspaces-list">
          {channels.map(c => (
            <div
              id={c.id}
              key={c.id}
              className={`workspace workspace-channel channel-${c.id}`}
              onClick={e => showChannelMessages(e, c)}
            >
              <div className="channel-details">
                <div>{c.name}</div>
                <div className={`channel-btns${c.owner_id === user.id ? ' me' : ' hidden'}`} onClick={e => e.stopPropagation()}>
                  <div className="update-channel-btn">
                    <OpenModalButton
                      buttonText={<i className="fa-solid fa-gear"></i>}
                      modalComponent={<UpdatedChannelModal channel={c} />}
                    />
                  </div>
                  <div className="delete-channel-btn">
                    <OpenModalButton
                      buttonText={<i className="fa-solid fa-trash-can delete-channel-btn"></i>}
                      modalComponent={
                        <ConfirmDeleteFormModal
                          text="Are you sure you want to delete this channel?"
                          deleteCb={e => deleteChannel(e, c.id)}
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

export default Channels;
