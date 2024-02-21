import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";

// Action
const ADD_MESSAGES = " messages/ADD_MESSAGES";
const RESET = 'messages/RESET';
const ADD_MESSAGE = "messages/ADD_MESSAGE";
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

const addMessage = message => {
  return {
    type: ADD_MESSAGE,
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
  dispatch(addMessage(data));
}

export const updateMessageThunk = (messageId, payload) => async dispatch => {
  const res = await csrfFetch(`/api/messages/${messageId}`, {
    method: "PUT",
    body: JSON.stringify({
      ...payload
    })
  });
  const data = await res.json();
  if (!res.ok) return { errors: data };
  dispatch(addMessage(data));
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
      const messages = {};
      action.messages.forEach(m => {
        messages[m.id] = m
      });
      return {
        ...state,
        messages: {
          ...messages
        }
      }
    }
    case ADD_MESSAGE:
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
      return { ...state, messages: {} };
    default:
      return state;
  }
}
