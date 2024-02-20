import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";

// Action
const ADD_MESSAGES = " messages/ADD_MESSAGES";
const RESET = 'messages/RESET';
const CREATE_MESSAGE = "messages/CREATE_MESSAGE";
const REMOVE_MESSAGE = "messages/REMOVE_MESSAGE";

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

const createMessage = message => {
  return {
    type: CREATE_MESSAGE,
    message
  }
}

const removeMessage = messageId => {
  return {
    type: REMOVE_MESSAGE,
    messageId
  }
}


// Thunk action creators
export const loadChannelMessages = channeId => async dispatch => {
  const res = await csrfFetch(`/api/channels/${channeId}/messages`);
  const data = await res.json();
  if (!res.ok) return { errors: data };
  dispatch(addMessages(data.Messages));
}

export const loadDirectMessages = (...ids) => async dispatch => {
  const res = await csrfFetch(`/api/auth/messages`);
  const data = await res.json();
  if (!res.ok) return { errors: data };

  let messages;
  if (ids[0] === ids[1]) {
    messages = data.Messages.filter(m => m.sender_id === m.receiver_id);
  } else {
    messages = data.Messages.filter(m => ids.includes(m.sender_id) && ids.includes(m.receiver_id) && m.sender_id !== m.receiver_id);
  }

  dispatch(addMessages(messages));
}

export const createMessageThunk = payload => async dispatch => {
  const res = await csrfFetch('/api/messages/', {
    method: "POST",
    body: JSON.stringify({
      ...payload
    })
  });
  const data = await res.json()
  if (!res.ok) return { errors: data };
  dispatch(createMessage(data));
}

export const deleteMessageThunk = messageId => async dispatch => {
  const res = await csrfFetch(`/api/messages/${messageId}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) return { errors: data.errors };
  dispatch(removeMessage(messageId));
}


// Custom selectors
export const getMessages = createSelector(
  state => state.messages.messages,
  messages => Object.values(messages)
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
    case CREATE_MESSAGE:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.message.id]: action.message
        }
      }
    case REMOVE_MESSAGE:
      const newState = { ...state };
      delete newState.messages[action.messageId];
      return newState;
    case RESET:
      return initialState;
    default:
      return state;
  }
}
