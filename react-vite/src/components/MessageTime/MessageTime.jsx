import { useState } from "react";

function MessageTime({ formattedDate, formattedTime, m, emojis, createReaction, user }) {
  const [showAllEmojis, setShowAllEmojis] = useState(false);
  const [searchEmoji, setSearchEmoji] = useState("");
  const [currentEmojis, setCurrentEmojis] = useState([...emojis]);
  const showEmojisHelper = icons => {
    return icons.map(emoji => {
      const codePoint = "0x" + emoji.codePoint.split(" ")[0];
      return (
        <div
          id={codePoint}
          className="emoji"
          key={emoji.slug}
          title={emoji.unicodeName.slice(5)}
          onClick={async e => {
            const reactions = e.target.closest(".message").querySelector(".reactions");
            if (reactions) {
              reactions.classList.add(`reaction-message-${m.id}`);
              const reaction = document.createElement('div');
              reaction.classList.add("reaction");
              reaction.setAttribute("title", `${user.first_name} ${user.last_name}`)
              reaction.textContent = String.fromCodePoint(codePoint);
              reactions.append(reaction);
              const data = await createReaction(reaction, m, e.target.id);
              reaction.setAttribute("id", `reaction-${data.id}`);
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
          className="fa-solid fa-face-smile add-reaction-icon"
          title="Add reaction"
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
          <div className="searchbox-emojis">
            <input
              type="text"
              spellCheck={false}
              placeholder={`Search for emojis`}
              value={searchEmoji}
              onChange={e => {
                setSearchEmoji(e.target.value);
                if (e.target.value === "") return setCurrentEmojis(emojis);
                setCurrentEmojis(emojis.filter(emoji => emoji.unicodeName.slice(5).toLowerCase().includes(e.target.value.toLowerCase())));
              }}
            />
          </div>
          {showAllEmojis ? (
            <div className="current-emojis">{showEmojisHelper(currentEmojis)}</div>
          ) : (
            <div className="current-emojis">{showEmojisHelper(currentEmojis.slice(0, 5))}</div>
          )}
          <p className="more-icons" onClick={e => {
            if (!showAllEmojis && e.target.textContent === '+') {
              e.target.textContent = '-'
              e.target.setAttribute("title", "Minimize");
              setShowAllEmojis(true);
            } else if (showAllEmojis && e.target.textContent === '-') {
              e.target.textContent = '+';
              e.target.setAttribute("title", "Expand");
              setShowAllEmojis(false);
            }
          }}>+</p>
        </div>
      </div >
      <div className="msg-date">{formattedDate(m.created_at)}</div>
      <div className="dot"><i className="fa-solid fa-circle"></i></div>
      <div className="msg-time">{formattedTime(m.created_at)}</div>
    </>
  );
}

export default MessageTime;
