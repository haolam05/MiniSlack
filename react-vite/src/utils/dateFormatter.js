export const formattedDate = date => {
  const parts = date.split(" ");
  const year = parts[3];
  const month = new Date(date).getMonth() + 1;
  const day = parts[1];
  return `${year}-${`${month}`.padStart(2, '0')}-${`${day}`.padStart(2, '0')}`;
};

export const formattedTime = date => {
  const parts = date.split(" ");
  const time = parts[4];
  return time;
};
