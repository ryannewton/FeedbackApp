// Import action types
import {
  AUTHORIZE_USER_SUCCESS,
  AUTHORIZE_USER_FAIL,
} from '../actions/types';

const INITIAL_STATE = {
  token: null,
  error: false,
  loginFailed: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTHORIZE_USER_SUCCESS:
      return { ...state, token: action.payload, error: false, loginFailed: false };
    case AUTHORIZE_USER_FAIL:
      return { ...state, token: null, error: action.payload, loginFailed: true };
    default:
      return state;
  }
};
