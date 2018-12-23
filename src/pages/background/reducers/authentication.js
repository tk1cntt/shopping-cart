import * as AuthenticationTypes from '../../constants/AuthenticationTypes';

const defaultState = {
  loading: false,
  isAuthenticated: false,
  loginSuccess: false,
  loginError: false, // Errors returned from server side
  showModalLogin: false,
  account: {},
  errorMessage: null, // Errors returned from server side
  redirectMessage: null
};

const authentication = (state = defaultState, action) => {
  switch (action.type) {
    case AuthenticationTypes.LOGIN_START:
    case AuthenticationTypes.GET_SESSION_START:
      return {
        ...state,
        loading: true
      };
    case AuthenticationTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loginError: false,
        showModalLogin: false,
        loginSuccess: true
      };
    case AuthenticationTypes.LOGIN_ERROR:
      return {
        ...state,
        errorMessage: action.payload,
        showModalLogin: true,
        loginError: true
      };
    case AuthenticationTypes.GET_SESSION_SUCCESS:
      const isAuthenticated =
        action.payload && action.payload.data && action.payload.data.activated;
      return {
        ...state,
        isAuthenticated,
        loading: false,
        account: action.payload.data
      };
    case AuthenticationTypes.GET_SESSION_ERROR:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        showModalLogin: true,
        errorMessage: action.payload
      };
    case AuthenticationTypes.CLEAR_AUTH:
      return {
        ...state,
        loading: false,
        showModalLogin: true,
        isAuthenticated: false
      };
  }
  return state;
};

export default authentication;
