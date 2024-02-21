import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";

// Action
const GET_CHANNELS = "channels/GET_CHANNELS";
const ADD_CHANNELS = "channels/addChannels";
const RESET = 'workspaces/RESET';
const DELETE_CHANNEL = "channels/DELETE_CHANNEL"


// POJO action creators
const getChannelsAction = channels => {
  return {
    type: GET_CHANNELS,
    channels
  }
}

const addChannelsAction = channel => {
  return {
    type: ADD_CHANNELS,
    channel
  }
}

export const reset = () => ({
  type: RESET
});


// Thunk action creators
export const loadChannels = workspaceId => async dispatch => {
  const res = await csrfFetch(`/api/workspaces/${workspaceId}/channels`);
  const data = await res.json();
  if (!res.ok) return { errors: data };
  dispatch(getChannelsAction(data.Channels));
}

export const deleteChannelThunk = () => async dispatch => {
  console.log('inside delete channel thunk')
}

export const addChannelsThunk = (workspaceId, channel) => async dispatch => {
  const res = await csrfFetch(`/api/workspaces/${workspaceId}/channels/`, {
    method: "POST",
    body: JSON.stringify({
      ...channel
    })
  });
  const data = await res.json();
  if (!res.ok) return { errors: data };
  dispatch(addChannelsAction(data));
}


// Custom selectors
export const getChannels = createSelector(
  state => state.channels.channels,
  channels => Object.values(channels)
);


// Reducer
const initialState = { channels: {} };

export default function channelReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CHANNELS: {
      const allChannels = {};
      action.channels.forEach(channel => allChannels[channel.id] = channel);
      return { ...state, channels: allChannels }
    }
    case ADD_CHANNELS: {
      return {
        ...state,
        channels: {
          ...action.channels
        }
      }
    }
    case RESET:
      return initialState;
    default:
      return state;
  }
}
