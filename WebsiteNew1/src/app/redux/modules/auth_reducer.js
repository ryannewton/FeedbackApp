import {
  SEND_AUTHORIZATION_EMAIL,
  SEND_AUTHORIZATION_EMAIL_SUCCESS,
  SEND_AUTHORIZATION_EMAIL_FAIL,
  AUTHORIZE_USER,
  AUTHORIZE_USER_SUCCESS,
  AUTHORIZE_USER_FAIL,
  SIGNOUT_USER,
} from './types';
import { push } from 'react-router-redux';

// localStorage.clear();
const token = localStorage.getItem('token');
const INITIAL_STATE = {
  email: '',
  authenticated: Boolean(token),
  error: '',
  loading: false,
  emailSentSuccess: false
}

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case SEND_AUTHORIZATION_EMAIL:
      return {...state, loading: true}
    case SEND_AUTHORIZATION_EMAIL_FAIL:
      return {...state, loading: false, emailSentSuccess: false}
    case SEND_AUTHORIZATION_EMAIL_SUCCESS:
      return { ...state, email: action.payload, emailSentSuccess: true, loading: false };
    case AUTHORIZE_USER:
      return {...state, loading: true};
    case AUTHORIZE_USER_SUCCESS:
      return { ...state, authenticated: true, error: '', loading: false };
    case AUTHORIZE_USER_FAIL:
      return { ...state, error: action.payload, authenticated: false, loading: false };
    case SIGNOUT_USER:
      localStorage.clear();
      return INITIAL_STATE;
  }

  return state;
}
