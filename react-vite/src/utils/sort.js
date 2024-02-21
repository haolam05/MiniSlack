export const sortDesc = dates => {
  return dates.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
