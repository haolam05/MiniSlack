function ChannelInfo({ headerName, c }) {
  return (
    <div id="channel-info-container">
      <h2 className="subheading">{headerName}</h2>
      <div className="channel-information">
        <div className="channel-info-label">
          <div>Topic</div>
          <p>{c.topic}</p>
        </div>
        <div className="channel-info-label">
          <div>Description</div>
          <p>{c.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ChannelInfo;
