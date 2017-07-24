import {
  AUTHORIZING_USER,
  AUTHORIZE_USER_SUCCESS,
  AUTHORIZE_USER_FAIL,
  SIGNOUT_USER,
} from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  authenticated: null,
  error: '',
  token: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTHORIZING_USER:
      return { ...state, loading: true };
    case AUTHORIZE_USER_SUCCESS:
      return { ...state, loading: false, authenticated: true, token: action.payload, error: '' };
    case AUTHORIZE_USER_FAIL:
      return { ...state, loading: false, authenticated: false, token: '', error: action.payload };
    case SIGNOUT_USER:
      return { ...state, INITIAL_STATE, authenticated: false };
    default:
      return state;
  }
};
