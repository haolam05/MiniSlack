import { csrfFetch } from "./csrf";

//Action
const GET_CHANNELS = "channels/getChannels";
const ADD_CHANNELS = "channels/addChannels";


// POJO action creators
const getChannelsAction = (channels) => {
    return {
        type: GET_CHANNELS,
        channels
    }
}

const addChannelsAction = (channel) => {
    return {
        type: ADD_CHANNELS,
        channel
    }
}


// Thunk action creators
export const getChannelsThunk = (workspaceId, channel) => async (dispatch) => {
    const res = await csrfFetch(`/api/workspaces/${workspaceId}/channels/`);
    const data = await res.json();
    if (!res.ok) return { errors: data }
    dispatch(getChannelsAction(data.Channels))
}

export const addChannelsThunk = (workspaceId, channel) => async (dispatch) => {
    const res = await csrfFetch(`/api/workspaces/${workspaceId}/channels/`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(channel)
    });
    const data = await res.json();
    if (!res.ok) return { errors: data };
    dispatch(addChannelsAction(data))
}


// Reducer
const initialState = { channels: {} };

export default function channelReducer(state = initialState, action) {
    switch (action.type) {
        case GET_CHANNELS: {
            const allChannels = {};
            action.channels.forEach(channel => allChannels[channel.id] = channel);
            return {...state, channels: allChannels}
        }
        case ADD_CHANNELS: {
            const newAllChannels = {...state.channels};
            newAllChannels[action.id] = action.channel;
            return {...state, channels: newAllChannels}
        }
        default:
            return state;
    }
}
