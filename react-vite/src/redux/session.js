import { csrfFetch } from "./csrf";
import * as workspaceActions from "./workspace";
import * as channelActions from "./channel";
import * as messageActions from "./message";
import * as membershipActions from "./membership";


// Actions
const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';
const ADD_EMOJIS = 'session/ADD_EMOJIS';


// POJO action creators
const setUser = user => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

const addEmojis = emojis => ({
  type: ADD_EMOJIS,
  emojis
});


// Thunk action creators
export const restoreSession = () => async (dispatch, getState) => {
  if (getState().session.user !== null) return;

  const response = await csrfFetch("/api/auth/");
  if (response.ok) {
    const data = await response.json();
    if (data.errors) return;
    dispatch(setUser(data));
  }
};

export const login = credentials => async dispatch => {
  const response = await csrfFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      ...credentials
    })
  });

  const data = await response.json();
  if (!response.ok) return { errors: data };
  dispatch(setUser(data));
};

export const signup = user => async dispatch => {
  const { first_name, last_name, profile_image_url, email, username, password } = user;
  const formData = new FormData();
  formData.append("first_name", first_name)
  formData.append("last_name", last_name)
  formData.append("email", email)
  formData.append("username", username)
  formData.append("password", password)

  if (profile_image_url) formData.append("profile_image_url", profile_image_url);

  const response = await csrfFetch("/api/auth/signup", {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  if (!response.ok) return { errors: data };
  dispatch(setUser(data));
};

export const updateUser = user => async dispatch => {
  const { first_name, last_name, profile_image_url, email, username, password } = user;
  const formData = new FormData();
  formData.append("first_name", first_name)
  formData.append("last_name", last_name)
  formData.append("email", email)
  formData.append("username", username)
  formData.append("password", password)

  if (profile_image_url) formData.append("profile_image_url", profile_image_url);

  const response = await csrfFetch("/api/auth/update", {
    method: "PUT",
    body: formData
  });

  const data = await response.json();
  if (!response.ok) return { errors: data };
  dispatch(setUser(data));
  dispatch(workspaceActions.reset());
  dispatch(channelActions.reset());
  dispatch(messageActions.reset());
  dispatch(membershipActions.reset());
};

export const updateUserPassword = user => async dispatch => {
  const response = await csrfFetch("/api/auth/password", {
    method: "PUT",
    body: JSON.stringify({
      ...user
    })
  });

  const data = await response.json();
  if (!response.ok) return { errors: data };
  dispatch(removeUser());
  dispatch(workspaceActions.reset());
  dispatch(channelActions.reset());
  dispatch(messageActions.reset());
  dispatch(membershipActions.reset());
};

export const deleteUser = () => async dispatch => {
  const response = await csrfFetch(`/api/auth/delete`, {
    method: "DELETE"
  });

  if (response.ok) {
    dispatch(removeUser());
    dispatch(workspaceActions.reset());
    dispatch(channelActions.reset());
    dispatch(messageActions.reset());
    dispatch(membershipActions.reset());
  }
};

export const logout = () => async dispatch => {
  await csrfFetch("/api/auth/logout");
  dispatch(removeUser());
  dispatch(workspaceActions.reset());
  dispatch(channelActions.reset());
  dispatch(messageActions.reset());
  dispatch(membershipActions.reset());
};

export const loadEmojis = () => async (dispatch, getState) => {
  if (getState().session.emojis !== null) return;
  const res = await csrfFetch("/api/auth/emojis");
  const data = await res.json();
  if (!res.ok) return { errors: data };
  dispatch(addEmojis(data));
}


// Custom selectors
export const sessionUser = state => state.session.user;
export const getEmojis = state => state.session.emojis;


// Reducer
const initialState = { user: null, emojis: null };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    case ADD_EMOJIS:
      return { ...state, emojis: action.emojis }
    default:
      return state;
  }
}

export default sessionReducer;
