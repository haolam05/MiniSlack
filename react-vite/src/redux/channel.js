import { csrfFetch } from "./csrf";

//Action
const ADD_CHANNAELS = "channels/addChannels";


// POJO action creators
const addChannelsAction = (channel) => {
    return {
        type: ADD_CHANNAELS,
        channel
    }
}


// Thunk action creators
export const addChannelsThunk = (workspaceId, channel) => async (dispatch) => {
    const res = await csrfFetch(`/api/workspaces/${workspaceId}/channels/`);
    const data = await res.json();
    if (!res.ok) return { errors: data };
    dispatch(addChannelsAction(channel))
}


// Reducer
const initialState = {};

export default function channelReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_CHANNAELS:
            return
        default:
            return state;
    }
}
