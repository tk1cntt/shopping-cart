import * as AuthenticationTypes from '../../constants/AuthenticationTypes';

const defaultState = {
  loading: false,
  isAuthenticated: false,
  loginSuccess: false,
  loginError: false, // Errors returned from server side
  account: {},
  errorMessage: null // Errors returned from server side
};

const authentication = (state = defaultState, action) => {
  switch (action.type) {
    case AuthenticationTypes.LOGIN_START:
    case AuthenticationTypes.GET_SESSION_START:
      return {
        ...state,
        loading: true,
        isAuthenticated: false,
        loginSuccess: false,
        loginError: false, // Errors returned from server side
        account: {},
        errorMessage: null // Errors returned from server side
      };
    case AuthenticationTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loginError: false,
        loginSuccess: true
      };
    case AuthenticationTypes.LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        errorMessage: action.data,
        loginError: true
      };
    case AuthenticationTypes.GET_SESSION_SUCCESS:
      const isAuthenticated = action.data && action.data.activated;
      return {
        ...state,
        isAuthenticated,
        loading: false,
        account: action.data
      };
    case AuthenticationTypes.GET_SESSION_ERROR:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        errorMessage: action.payload
      };
    case AuthenticationTypes.CLEAR_AUTH:
      return {
        ...state,
        loading: false,
        isAuthenticated: false
      };
  }
  return state;
};

export default authentication;
