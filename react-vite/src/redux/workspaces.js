import { csrfFetch } from "./csrf"

// Actions
const ADD_WORKSPACES = 'worksapces/ADD_WORKSPACES'


// POJO action creators
const addWorkspaces = workspaces => ({
  type: ADD_WORKSPACES,
  workspaces
});


// Thunk action creators
export const loadWorkspaces = () => async dispatch => {
  const response = await csrfFetch("/api/workspaces");
  const data = await response.json();
  if (!response.ok) return { errors: data };
  dispatch(addWorkspaces(data));
}


// Custom selectors
// export const getWorkspaces = () => createSelect


// Reducer
const initialState = { workspaces: {} };

function workspaceReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_WORKSPACES:
      return {
        ...state,
        workspaces: {
          ...state.workspaces,
          ...action.workspaces.reduce((state, workspace) => (state[workspace.id] = workspace), {})
        }
      }
    default:
      return state;
  }
}

export default workspaceReducer;
