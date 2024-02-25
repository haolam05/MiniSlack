import { useState } from "react";
import "./WelcomeModal.css";

const WelcomeModal = () => {
    const [isOpen, setIsOpen] = useState(true);
    const onClose = () => setIsOpen(false);

    return (
        <div className={isOpen ? "welcome-modal visible" : "welcome-modal hidden"}>
            <i className="fa-solid fa-circle-xmark close-welcome-modal" onClick={onClose}></i>
            <div className="welcome-to-minislack">
                <i className="fa-solid fa-people-roof"></i>
                <h1>Welcome to MiniSlack</h1>
                <i className="fa-solid fa-people-roof"></i>
            </div>
            <p>MiniSlack is an amazing place where you and your closest friends can spend time together. Say goodbye to scheduling struggles! Minislack makes effortless connection, making daily chats and spontaneous gatherings a breeze.</p>
            <br />
            <p>Here, you can create as many as workspaces you like and invite your family, friends, classmates, and co-workers to join for free. You can create channels within a workspace with fantastic topics. If you are the owner of the workspace, you can update and delete a workspace, and send invitation to your friends to join the workspace. As the workspace owner, you can update, delete channels, and remove members from a workspace. When sending messages, you can easily update and delete the messages in case of typos. Moreoever, you can add reactions to messages to show your friends how you feel. More functions are waiting for you to explore...</p>
            <br />
            <p>Ready to unlock deeper connections? Join us today!</p>
        </div>
    )
}

export default WelcomeModal;
