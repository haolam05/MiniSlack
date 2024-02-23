import { useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import ConfirmDeleteFormModal from "../ConfirmDeleteFormModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import UpdatedChannelModal from "../UpdateChannelModal";
import ChannelFormModal from "../ChannelFormModal";
import * as channelActions from "../../redux/channel";

function Channels({ user, collapseWorkspaces, channels, showChannelMessages }) {
  const dispatch = useDispatch();
  const { closeModal, setModalContent } = useModal();
  const [searchChannel, setSearchChannel] = useState("");
  const [currentChannels, setCurrentChannels] = useState(channels);


  const deleteChannel = async (_e, channelId) => {
    const channel = document.querySelector(`.channel-${channelId}`);
    if (!channel) return;

    const isChannelMsg = channel.classList.contains("selected");
    await dispatch(channelActions.deleteChannelThunk(channelId, isChannelMsg));
    setModalContent(<h2 className="subheading alert-success">Successfully deleted</h2>)
    const header = document.querySelector(".message-header");
    const selectedChannel = document.querySelector(".workspace-channel.selected");
    if (header) {
      if (selectedChannel === null || +selectedChannel?.id === channelId) header.textContent = "";
    }
    channel.remove();
  }

  const createChannel = async () => {
    const workspace = document.querySelector(".workspace.selected");
    if (!workspace) return setModalContent(<h2 className="subheading modal-errors">Please select a workspace first</h2>)
    await setModalContent(<ChannelFormModal />);
    const currentDm = document.querySelector(".workspace-message.selected");
    if (currentDm) currentDm.classList.remove("selected");
  }

  const channelSettingClasses = c => {
    const workspace = document.querySelector(".workspace.selected");
    if (!workspace) return;
    const workspaceOwnerId = workspace.dataset.workspaceOwnerId;
    return c.owner_id === user.id || +workspaceOwnerId === user.id ? ' me' : ' hidden';
  }

  return (
    <div id="workspaces" className="channels">
      <h2 className="subheading">
        <span>Channels</span>
        <i className="fa-solid fa-square-minus" onClick={collapseWorkspaces} title="Minimize"></i>
        {user?.user !== null && <i className="fa-solid fa-square-plus" onClick={createChannel} title="Create a New Channel"></i>}
      </h2>
      <div className="workspaces-list-wrapper">
        <div className="workspaces-list">
          <div className="searchbox-channels">
            <input
              type="text"
              spellCheck={false}
              placeholder={`🔍 Search for channels`}
              value={searchChannel}
              onChange={e => {
                setSearchChannel(e.target.value);
                if (e.target.value === "") return setCurrentChannels(channels);
                setCurrentChannels(channels.filter(channel => channel.name.toLowerCase().includes(e.target.value.toLowerCase())));
              }}
            />
          </div>
          {currentChannels.map(c => (
            <div
              id={c.id}
              key={c.id}
              className={`workspace workspace-channel channel-${c.id}`}
              onClick={e => showChannelMessages(e, c)}
            >
              <div className="channel-details">
                <div>{c.name}</div>
                <div className={`channel-btns${channelSettingClasses(c)}`} onClick={e => e.stopPropagation()}>
                  <div className="update-channel-btn">
                    <OpenModalButton
                      buttonText={<i className="fa-solid fa-gear" title="Update"></i>}
                      modalComponent={<UpdatedChannelModal channel={c} />}
                    />
                  </div>
                  <div className="delete-channel-btn">
                    <OpenModalButton
                      buttonText={<i className="fa-solid fa-trash-can delete-channel-btn" title="Delete"></i>}
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
