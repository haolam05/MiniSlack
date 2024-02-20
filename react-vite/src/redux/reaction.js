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

const deleteReaction = reaction => {
    return {
        type: DELETE_REACTION,
        reaction
    }
}

//Thunk:


//Reducer
