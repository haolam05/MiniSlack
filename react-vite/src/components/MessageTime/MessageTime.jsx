import { useState } from "react";

function MessageTime({ formattedDate, formattedTime, m, emojis, createReaction }) {
  const [showAllEmojis, setShowAllEmojis] = useState(false);

  const showEmojisHelper = icons => {
    return icons.map(emoji => {
      const codePoint = "0x" + emoji.codePoint.split(" ")[0];
      return (
        <div
          id={codePoint}
          className="emoji"
          key={emoji.slug}
          onClick={e => {
            const reactions = e.target.closest(".message").querySelector(".reactions");
            if (reactions) {
              const reaction = document.createElement('div');
              reaction.classList.add("reaction");
              reaction.textContent = String.fromCodePoint(codePoint);
              reactions.append(reaction);
              createReaction(reaction, m, e.target.id);
            }
          }}
        >
          {String.fromCodePoint(codePoint)}
        </div>
      );
    })
  }

  return (
    <>
      <div className="message-time-dot">
        <i
          title="Add Reactions"
          className="fa-solid fa-face-smile"
          onClick={e => {
            const reactions = e.target.parentElement.querySelector(".reaction-icons");
            const date = e.target.parentElement.parentElement.querySelector(".msg-date");
            const time = e.target.parentElement.parentElement.querySelector(".msg-time");
            const dot = e.target.parentElement.parentElement.querySelector(".dot");
            if (date) date.classList.add("hidden");
            if (time) time.classList.add("hidden");
            if (dot) dot.classList.add("hidden");
            reactions.classList.remove("hidden");
            e.target.classList.add("hidden");
          }}
        >
        </i>
        <div className="reaction-icons hidden" onClick={e => {
          if (e.target.classList.contains("reaction-icons")) {
            e.target.classList.add("hidden");
            const reactions = e.target.parentElement.querySelector("i");
            const date = e.target.parentElement.parentElement.querySelector(".msg-date");
            const time = e.target.parentElement.parentElement.querySelector(".msg-time");
            const dot = e.target.parentElement.parentElement.querySelector(".dot");
            if (reactions) reactions.classList.remove('hidden');
            if (date) date.classList.remove("hidden");
            if (time) time.classList.remove("hidden");
            if (dot) dot.classList.remove("hidden");
          }
        }}>
          {showAllEmojis ? (
            <div className="current-emojis">{showEmojisHelper(emojis)}</div>
          ) : (
            <div className="current-emojis">{showEmojisHelper(emojis.slice(0, 5))}</div>
          )}
          <p className="more-icons" onClick={e => {
            if (!showAllEmojis && e.target.textContent === '+') {
              e.target.textContent = '-'
              setShowAllEmojis(true);
            } else if (showAllEmojis && e.target.textContent === '-') {
              e.target.textContent = '+';
              setShowAllEmojis(false);
            }
          }}>+</p>
        </div>
      </div>
      <div className="msg-date">{formattedDate(m.created_at)}</div>
      <div className="dot"><i className="fa-solid fa-circle"></i></div>
      <div className="msg-time">{formattedTime(m.created_at)}</div>
    </>
  );
}

export default MessageTime;
