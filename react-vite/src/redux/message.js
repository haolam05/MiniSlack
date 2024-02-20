import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";

// Action
const ADD_MESSAGES = " messages/ADD_MESSAGES";
const RESET = 'messages/RESET';
const CREATE_MESSAGE = "messages/CREATE_MESSAGE";

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

// Thunk action creators
export const loadMessages = channeId => async dispatch => {
  const res = await csrfFetch(`/api/channels/${channeId}/messages`);
  const data = await res.json();
  if (!res.ok) return { errors: data };
  dispatch(addMessages(data.Messages));
}

export const createMessageThunk = (payload) => async dispatch => {
    const res = await csrfFetch('/api/messages', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (!res.ok) return { errors: data };
    dispatch(createMessage(data))
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
          ...state.messages,
          ...action.messages
        }
      }
    }
    case RESET:
      return initialState;
    case CREATE_MESSAGE: {
        const allMessages = {
            ...state.messages
        }
        allMessages[action.id] = action.message
        return {...state, messages: allMessages}
    }
    default:
      return state;
  }
}
