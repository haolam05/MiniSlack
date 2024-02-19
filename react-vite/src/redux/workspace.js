import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";

// Actions
const ADD_WORKSPACES = 'worksapces/ADD_WORKSPACES'
const RESET = 'workspaces/RESET';


// POJO action creators
const addWorkspaces = workspaces => ({
  type: ADD_WORKSPACES,
  workspaces
});

export const reset = () => ({
  type: RESET
});


// Thunk action creators
export const loadWorkspaces = () => async (dispatch, getState) => {
  if (Object.values(getState().workspaces.workspaces).length) return;
  const response = await csrfFetch("/api/workspaces/");
  const data = await response.json();
  if (!response.ok) return { errors: data };
  dispatch(addWorkspaces({ ...data.JoinedWorkspaces, ...data.OwnedWorkspaces }));
}


// Custom selectors
export const getWorkspaces = createSelector(
  state => state.workspaces,
  workspaces => Object.values(workspaces)
)


// Reducer
const initialState = { workspaces: {} };

function workspaceReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_WORKSPACES:
      return {
        ...state,
        workspaces: {
          ...state.workspaces,
          ...action.workspaces
        }
      }
    case RESET:
      return initialState;
    default:
      return state;
  }
}

export default workspaceReducer;
