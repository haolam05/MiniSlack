function EmojisList({ emojis, setMessageInput }) {
  return (
    <div className="emojis-list hidden">
      {emojis && (
        <div className="icon-emojis">
          {emojis.map(emoji => {
            const codePoint = "0x" + emoji.codePoint.split(" ")[0];
            return (
              <div
                id={codePoint}
                className="emoji"
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
