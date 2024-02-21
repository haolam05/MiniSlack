import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";
import * as channelActions from "./channel";
import * as membershipActions from "./membership";
import * as messageActions from "./message";

// Actions
const LOAD_WORKSPACES = 'worksapce/LOAD_WORKSPACES';
const RESET = 'workspaces/RESET';
const CREATE_WORKSPACE = "workspace/CREATE_WORKSPACE";
const EDIT_WORKSPACE = "workspace/EDIT_WORKSPACE";
const DELETE_WORKSPACE = "workspace/DELETE_WORKSPACE";


// POJO action creators
const loadWorkspacesAction = workspaces => ({
  type: LOAD_WORKSPACES,
  workspaces
});

const createWorkspaceAction = workspace => {
  return {
    type: CREATE_WORKSPACE,
    workspace
  }
}

const editWorkspaceAction = workspace => {
  return {
    type: EDIT_WORKSPACE,
    workspace
  }
}

const deleteWorkspaceAction = workspaceId => {
  return {
    type: DELETE_WORKSPACE,
    workspaceId
  }
}

export const reset = () => ({
  type: RESET
});


// Thunk action creators
export const loadWorkspaces = () => async (dispatch, getState) => {
  if (Object.values(getState().workspaces.workspaces).length) return;
  const response = await csrfFetch("/api/workspaces/");
  const data = await response.json();
  if (!response.ok) return { errors: data };
  dispatch(loadWorkspacesAction(data.JoinedWorkspaces));
}

export const createWorkspaceThunk = workspace => async dispatch => {
  const res = await csrfFetch(`/api/workspaces/`, {
    method: "POST",
    body: JSON.stringify({
      ...workspace
    })
  });
  const data = await res.json();
  console.log(data)
  if (!res.ok) return { errors: data };
  dispatch(createWorkspaceAction(data));
}

export const editWorkspaceThunk = (workspaceId, workspace) => async dispatch => {
  const res = await csrfFetch(`/api/workspaces/${workspaceId}`, {
    method: "PUT",
    body: JSON.stringify({
      ...workspace
    })
  });
  const data = await res.json();
  if (!res.ok) return { errors: data }
  dispatch(editWorkspaceAction(data));
}

export const deleteWorkspaceThunk = workspaceId => async dispatch => {
  const res = await csrfFetch(`/api/workspaces/${workspaceId}`, {
    method: "DELETE"
  });
  const data = await res.json();
  if (!res.ok) return { errors: data }
  dispatch(channelActions.reset());
  dispatch(messageActions.reset());
  dispatch(membershipActions.reset());
  dispatch(deleteWorkspaceAction(workspaceId));
}

// Custom selectors
export const getWorkspaces = createSelector(
  state => state.workspaces.workspaces,
  workspaces => Object.values(workspaces)
)


// Reducer
const initialState = { workspaces: {} };

function workspaceReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_WORKSPACES: {
      const allWorkspaces = {}
      action.workspaces.forEach(wo => allWorkspaces[wo.id] = wo)
      return { ...state, workspaces: allWorkspaces }
    }
    case CREATE_WORKSPACE: {
      return {
        ...state,
        workspaces: {
          ...state.workspaces,
          [action.workspace.id]: action.workspace
        }
      }
    }
    case EDIT_WORKSPACE: {
      return {
        ...state,
        workspaces: {
          ...state.workspaces,
          [action.workspace.id]: action.workspace
        }
      }
    }
    case DELETE_WORKSPACE: {
      const allWorkspaces = { ...state.workspaces };
      delete allWorkspaces[action.workspaceId];
      return { ...state, workspaces: allWorkspaces }
    }
    case RESET:
      return initialState;
    default:
      return state;
  }
}

export default workspaceReducer;
