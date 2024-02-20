import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";

// Action
const ADD_MESSAGES = " messages/ADD_MESSAGES";
const RESET = 'messages/RESET';

// POJO action creators
const addMessages = messages => {
  return {
    type: ADD_MESSAGES,
    messages
  }
}
export const reset = () => ({
  type: RESET
});


// Thunk action creators
export const loadMessages = channeId => async dispatch => {
  const res = await csrfFetch(`/api/channels/${channeId}/messages`);
  const data = await res.json();
  if (!res.ok) return { errors: data };
  dispatch(addMessages(data.Messages));
}

export const loadDirectMessages = (...ids) => async dispatch => {
  const res = await csrfFetch(`/api/auth/messages`);
  const data = await res.json();
  if (!res.ok) return { errors: data };
  const messages = data.Messages.filter(m => ids.includes(m.sender_id) && ids.includes(m.receiver_id));
  dispatch(addMessages(messages));
}


// Custom selectors
export const getMessages = createSelector(
  state => state.messages.messages,
  messages => Object.values(messages)
);


export const getDirectMessages = (id1, id2) => createSelector(
  state => state.messages.messages,
  messages => Object.values(messages).filter(m => {
    const ids = [m.receiver_id, m.sender_id];
    return ids.includes(id1) && ids.includes(id2);
  })
);


// Reducer
const initialState = { messages: {} };

export default function messageReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_MESSAGES: {
      return {
        ...state,
        messages: {
          ...action.messages
        }
      }
    }
    case RESET:
      return initialState;
    default:
      return state;
  }
}
