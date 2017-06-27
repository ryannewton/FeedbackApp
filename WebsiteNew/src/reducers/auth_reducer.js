import {
  SEND_AUTHORIZATION_EMAIL,
  SEND_AUTHORIZATION_EMAIL_SUCCESS,
  SEND_AUTHORIZATION_EMAIL_FAIL,
  AUTHORIZE_USER,
  AUTHORIZE_USER_SUCCESS,
  AUTHORIZE_USER_FAIL,
  SIGNOUT_USER,
} from '../actions/types';

const INITIAL_STATE = {
  email: '',
  authenticated: false,
  error: '',
}

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case SEND_AUTHORIZATION_EMAIL_SUCCESS:
      return { ...state, email: action.payload };
    case AUTHORIZE_USER_SUCCESS:
      return { ...state, authenticated: true, error: '' };
    case AUTHORIZE_USER_FAIL:
      return { ...state, error: action.payload };
    case SIGNOUT_USER:
      return INITIAL_STATE;
  }

  return state;
}
