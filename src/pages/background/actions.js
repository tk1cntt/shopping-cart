//BOOKMARKS ACTIONS

export const loginStart = () => ({
  type: 'LOGIN_START'
});

export const loginError = data => ({
  type: 'LOGIN_ERROR',
  data
});

export const loginSuccess = data => ({
  type: 'LOGIN_SUCCESS',
  data
});

export const getSessionStart = () => ({
  type: 'GET_SESSION_START'
});

export const getSessionError = data => ({
  type: 'GET_SESSION_ERROR',
  data
});

export const getSessionSuccess = data => ({
  type: 'GET_SESSION_SUCCESS',
  data
});

export const refreshBookmark = (data, time) => ({
  type: 'REFRESH',
  urlList: data,
  expiry: time
});

export const deleteAllBookmark = () => ({
  type: 'DELETE-ALL'
});

export const deleteOneBookmark = url => ({
  type: 'DELETE-ONE',
  url: url
});

export const addBookmark = url => ({
  type: 'ADD',
  urlList: url,
  expiry: new Date().getTime()
});

export const addFromButton = flag => ({
  type: 'DELETE-ONE',
  addFromButton: flag
});

export const searchBookmark = text => ({
  type: 'SEARCH',
  textSearched: text
});

export const emptySearch = () => ({
  type: 'EMPTY-SEARCH'
});

//SETTINGS actions

export const toggleButton = flag => ({
  type: 'TOGGLE-BUTTON',
  toggleButton: flag
});

export const expireDate = date => ({
  type: 'UPDATE-DATE',
  expireDate: date
});

export const toggleButtonHistory = flag => ({
  type: 'TOGGLE-BUTTON-HISTORY',
  toggleButtonHistory: flag
});

// ANIMATION ACTIONS

export const buttonCog = flag => ({
  type: 'TOGGLE-COG',
  buttonCog: flag
});

export const toggleSearch = classValue => ({
  type: 'TOGGLE-SEARCH',
  toggleSearch: classValue
});
