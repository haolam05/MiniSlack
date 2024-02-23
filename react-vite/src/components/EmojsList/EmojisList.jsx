import { useEffect, useState } from "react";

function EmojisList({ emojis, setMessageInput }) {
  const [searchEmoji, setSearchEmoji] = useState("");
  const [currentEmojis, setCurrentEmojis] = useState(emojis ? [...emojis] : []);

  useEffect(() => {
    setCurrentEmojis(emojis ? [...emojis] : []);
  }, [emojis]);

  if (!emojis) return;

  return (
    <div className="emojis-list hidden">
      {currentEmojis && (
        <div className="icon-emojis">
          {!emojis.length ? '' : <div className="searchbox-icons">
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
          </div>}
          {currentEmojis.map(emoji => {
            const codePoint = "0x" + emoji.codePoint.split(" ")[0];
            return (
              <div
                id={codePoint}
                className="emoji"
                title={emoji.unicodeName.slice(5)}
                key={emoji.slug}
                onClick={e => setMessageInput(prev => prev + String.fromCodePoint(e.target.id))}
              >
                {String.fromCodePoint(codePoint)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default EmojisList;
