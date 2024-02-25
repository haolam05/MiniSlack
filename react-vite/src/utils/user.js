import { csrfFetch } from "../redux/csrf"

export const userIsValid = user => {
  return user && user.user !== null;
}

export const formatUserChannel = channel => {
  if (channel) {
    const name = channel[0].toUpperCase() + channel.slice(1).toLowerCase();
    return name.split("\n")[0];
  }
}

export const getInviteUsers = async workspaceId => {
  const res = await csrfFetch(`/api/users/`);
  const data = await res.json();
  if (!res.ok) return { errors: data };

  const res2 = await csrfFetch(`/api/workspaces/${workspaceId}/memberships`);
  const data2 = await res2.json();
  if (!res2.ok) return { errors: data2 };
  const memberIds = data2.Members.map(m => m.id);
  return data.users.filter(user => !memberIds.includes(user.id) && !user.is_deleted);
}
