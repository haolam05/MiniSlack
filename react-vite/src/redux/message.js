import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";

// Action
const ADD_MESSAGES = " messages/ADD_MESSAGES";
const ADD_MESSAGE = "messages/ADD_MESSAGE";
const ADD_REACTION = "messages/ADD_REACTION";
const REMOVE_MESSAGE = "messages/REMOVE_MESSAGE";
const RESET = 'messages/RESET';


// POJO action creators
const addMessages = messages => {
  return {
    type: ADD_MESSAGES,
    messages
  }
}

export const addReaction = (messageId, reaction) => {
  return {
    type: ADD_REACTION,
    messageId,
    reaction
  }
}

export const reset = () => ({
  type: RESET
});

export const addMessage = message => {
  return {
    type: ADD_MESSAGE,
    message
  }
}

export const removeMessage = messageId => {
  return {
    type: REMOVE_MESSAGE,
    messageId
  }
}


// Thunk action creators
export const loadChannelMessages = channelId => async (dispatch, getState) => {
  const channelMessages = Object.values(getState().messages.messages);
  if (channelMessages.length && channelMessages[0].channel_id === channelId) return;
  const res = await csrfFetch(`/api/channels/${channelId}/messages`);
  const data = await res.json();
  if (!res.ok) return { errors: data };
  dispatch(addMessages(data.Messages));
}

export const loadDirectMessages = (id1, id2, workspaceId) => async (dispatch, getState) => {
  const directMessages = Object.values(getState().messages.messages);
  if (directMessages.length) {
    const ids = [id1, id2].sort((a, b) => a - b);
    const ids2 = [directMessages[0].sender_id, directMessages[0].receiver_id].sort((a, b) => a - b);
    if (ids[0] === ids2[0] && ids[1] === ids2[1]) return;
  }
  const res = await csrfFetch(`/api/auth/messages`);
  const data = await res.json();
  if (!res.ok) return { errors: data };

  let messages;
  if (id1 === id2) {
    messages = data.Messages.filter(m => m.sender_id === m.receiver_id && m.workspace_id === workspaceId);
  } else {
    const ids = [id1, id2];
    messages = data.Messages.filter(m => ids.includes(m.sender_id) && ids.includes(m.receiver_id) && m.sender_id !== m.receiver_id && m.workspace_id === workspaceId);
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

export const addMessageThunk = message => async (dispatch, getState) => {
  if (getState().messages?.messages[message.id]) return;
  dispatch(addMessage(message));
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
    case ADD_REACTION: {
      const newState = { ...state };
      const reactions = newState.messages[action.messageId].reactions;
      const reaction_ids = reactions.map(reaction => reaction.id);
      if (!reaction_ids.includes(action.reaction.id)) {
        reactions.push(action.reaction);
      }
      return newState;
    }
    case REMOVE_MESSAGE: {
      const newState = { ...state };
      delete newState.messages[action.messageId];
      return newState;
    }
    case RESET:
      return { ...state, messages: {} };
    default:
      return state;
  }
}
