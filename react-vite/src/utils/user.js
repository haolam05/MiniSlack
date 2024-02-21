export const userIsValid = user => {
  return user && user.user !== null;
}

export const formatUserChannel = channel => {
  if (channel) {
    const name = channel[0].toUpperCase() + channel.slice(1).toLowerCase();
    return name.split("\n")[0];
  }
}
