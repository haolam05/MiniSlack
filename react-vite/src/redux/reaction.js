import { csrfFetch } from "./csrf";

// Actions
const SEND_REACTION = "reactions/sendReaction";
const DELETE_REACTION = "reaction/deleteReaction";


// POJO action creator
const sendReactionAction = reaction => {
  return {
    type: SEND_REACTION,
    reaction
  }
}

const deleteReactionAction = reactionId => {
  return {
    type: DELETE_REACTION,
    reactionId
  }
}


// Thunk action creators
export const sendReactionThunk = (messageId, reaction) => async dispatch => {
  const res = await csrfFetch(`/api/messages/${messageId}/reactions`, {
    method: "POST",
    body: JSON.stringify({
      encoded_text: reaction
    })
  });
  const data = await res.json();
  if (!res.ok) return { errors: data }
  dispatch(sendReactionAction(data))
}

export const deleteReactionThunk = (messageId, reactionId) => async dispatch => {
  const res = await csrfFetch(`/api/messages/${messageId}/reactions/${reactionId}/`, {
    method: "DELETE"
  });
  const data = await res.json();
  if (!res.ok) return { errors: data }
  dispatch(deleteReactionAction(reactionId))
}


// Custom selectors
export const getReactions = () => {
  state => state.reactions,
    reactions => Object.values(reactions)
}


// Reducer
const initialState = { reactions: {} };
export default function reactionReducer(state = initialState, action) {
  switch (action.type) {
    case SEND_REACTION: {
      return {
        ...state,
        reactions: {
          ...state.reactions,
          [action.reaction.id]: action.reaction
        }
      }
    }
    case DELETE_REACTION: {
      const allReactions = { ...state.reactions };
      delete allReactions[action.reactionId];
      return { ...state, reactions: allReactions }
    }
    default:
      return state
  }
}
