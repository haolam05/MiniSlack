export const userIsValid = user => {
  return user && user.user !== null;
}

export const formatUserChannel = channel => {
  if (channel) return channel[0].toUpperCase() + channel.slice(1).toLowerCase();
}
