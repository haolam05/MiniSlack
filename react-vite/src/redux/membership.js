import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";

// Action
const ADD_MEMBERSHIPS = " memberships/ADD_MEMBERSHIPS";
const RESET = 'memberships/RESET';


// POJO action creators
const addMemberships = memberships => {
  return {
    type: ADD_MEMBERSHIPS,
    memberships
  }
}

export const reset = () => ({
  type: RESET
});


// Thunk action creators
export const loadMemberships = workspaceId => async dispatch => {
  const res = await csrfFetch(`/api/workspaces/${workspaceId}/memberships`);
  const data = await res.json();
  if (!res.ok) return { errors: data };
  dispatch(addMemberships(data.Members));
}


// Custom selectors
export const getMemberships = createSelector(
  state => state.memberships.memberships,
  memberships => Object.values(memberships)
);


// Reducer
const initialState = { memberships: {} };

export default function membershipReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_MEMBERSHIPS: {
      return {
        ...state,
        memberships: {
          ...action.memberships
        }
      }
    }
    case RESET:
      return { ...state, memberships: {} };
    default:
      return state;
  }
}
