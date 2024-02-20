import { csrfFetch } from "./csrf";

//Action type:
const LOAD_REACTIONS = "reactions/loadReactions";
const SEND_REACTION = "reactions/sendReaction";
const DELETE_REACTION = "reaction/deleteReaction";


//Action creator:
const loadReactionsAction = reactions => {
    return {
        type: LOAD_REACTIONS,
        reactions
    }
}

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

//Thunk:
export const loadReactionsThunk = (messageId) => async dispatch => {
    const res = await csrfFetch(`/api/messages/${messageId}/reactions/`);
    const data = await res.json();
    if (!res.ok) return {errors: data}
    dispatch(loadReactionsAction(data.Reactions))
}

export const sendReactionThunk = (messageId, reaction) => async dispatch => {
    const res = await csrfFetch(`/api/messages/${messageId}/reactions/`, {
        method: "POST",
        body: JSON.stringify(reaction)
    });
    const data = await res.json();
    if (!res.ok) return {errors: data}
    dispatch(sendReactionAction(data))
}

export const deleteReactionThunk = (messageId, reactionId) => async dispatch => {
    const res = await csrfFetch(`/api/messages/${messageId}/reactions/${reactionId}/`, {
        method: "DELETE"
    });
    const data = await res.json();
    if (!res.ok) return {errors: data}
    dispatch(deleteReactionAction(reactionId))
}

//Reducer
const initialState = { reactions: {} };
export default function reactionReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_REACTIONS: {
            const allReactions = {};
            action.reactions.forEach(re => allReactions[re.id] = re);
            return { ...state, reactions: allReactions }
        }
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
