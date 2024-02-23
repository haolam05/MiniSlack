import { useState } from "react";
import "./WelcomeModal.css";

const WelcomeModal = () => {
    const [isOpen, setIsOpen] = useState(true);
    const onClose = () => setIsOpen(false);

    return (
        <div className={isOpen ? "welcome-modal visible" : "welcome-modal hidden"}>
            <i class="fa-solid fa-circle-xmark close-welcome-modal" onClick={onClose}></i>
            <div className="welcome-to-minislack">
                <i class="fa-solid fa-people-roof"></i>
                <h1>Welcome to MiniSlack</h1>
                <i class="fa-solid fa-people-roof"></i>
            </div>
            <p>MiniSlack is an amazing place Where just you and your closest friends can spend time together. Say goodbye to scheduling struggles! This haven fosters effortless connection, making daily chats and spontaneous gatherings a breeze.</p>
            <p>Here you can create as many as workspaces you like and invite your family, friends, classmates, and co-workers into your workspaces for free. You can create channels within a workspace with fantastic topics. If you are the owner of the workspace, you can update and delete a workspace, and send invitation to your friends to join this workspace. Ofcourse, as the workspace owner, you can update and delete channels, and remove members from a workspace. When you send messages, you can update and delete the messages you unsatisfied, you even can add reactions to messages to show your attitude. More functions are waiting for you to explore...</p>
            <p>Ready to unlock deeper connections? Join us today!</p>
        </div>
    )
}

export default WelcomeModal;
