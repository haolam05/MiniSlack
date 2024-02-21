import { csrfFetch } from "../redux/csrf";

export const createReactionApi = async (messageId, reaction) => {
  const res = await csrfFetch(`/api/messages/${messageId}/reactions`, {
    method: "POST",
    body: JSON.stringify({
      encoded_text: reaction
    })
  });
  const data = await res.json();
  if (!res.ok) return { errors: data }
  return data;
}

export const deleteReactionApi = async (messageId, reactionId) => {
  const res = await csrfFetch(`/api/messages/${messageId}/reactions/${reactionId}`, {
    method: "DELETE"
  });
  const data = await res.json();
  if (!res.ok) return { errors: data }
}
