import { csrfFetch } from "./csrf";


// Actions
const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';


// POJO action creators
const setUser = user => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});


// Thunk action creators
export const restoreSession = () => async dispatch => {
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
  if (!response.ok) return { errros: data };
  dispatch(setUser(data));
};

export const signup = user => async dispatch => {
  const response = await csrfFetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      ...user
    })
  });

  const data = await response.json();
  if (!response.ok) return { errors: data };
  dispatch(setUser(data));
};

export const thunkLogout = () => async dispatch => {
  await fetch("/api/auth/logout", {
    method: 'DELETE'
  });
  dispatch(removeUser());
};


// Custom selectors
export const sessionUser = state => state.session.user;


// Reducer
const initialState = { user: null };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
}

export default sessionReducer;
