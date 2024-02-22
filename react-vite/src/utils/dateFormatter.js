export const formattedDate = inputDate => {
  const date = new Date(inputDate)
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  const [year, month, day] = [localDate.getFullYear(), localDate.getMonth() + 1, localDate.getDate()]
  return `${year}-${`${month}`.padStart(2, '0')}-${`${day}`.padStart(2, '0')}`;
};

export const formattedTime = inputDate => {
  const date = new Date(inputDate)
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  const [hour, min, sec] = [`${localDate.getHours()}`, `${localDate.getMinutes()}`, `${localDate.getSeconds()}`].map(t => t.padStart(2, '0'));
  return `${hour}:${min}:${sec}`;
};
