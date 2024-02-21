import { useModal } from "../../context/Modal";
import { deleteChannelThunk } from "../../redux/channel";
import ConfirmDeleteFormModal from "../ConfirmDeleteFormModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";



function Channels({ collapseWorkspaces, channels, showChannelMessages }) {
const {closeModal} = useModal()

  const deleteChannel = () => {
    
  }

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
              <div>
              <div>
                <OpenModalButton
                  buttonText={<i className="fa-solid fa-trash-can"></i>}
                  modalComponent={<ConfirmDeleteFormModal 
                    text="Are you sure you want to delete this channel?"
                    deleteCb={deleteChannel}
                    cancelDeleteCb={closeModal}
                  />}
                />
              </div>
              <div>
                <OpenModalButton
                  buttonText= {<i className="fa-solid fa-gear"></i>}
                  modalComponent={<ConfirmDeleteFormModal />}
                />
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

{/* <span><i className="fa-solid fa-gear"></i></span>
<span><i className="fa-solid fa-trash-can"></i></span> */}

export default Channels;
