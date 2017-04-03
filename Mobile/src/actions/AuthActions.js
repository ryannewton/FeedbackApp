// Import Libraries
import { AsyncStorage } from 'react-native';

// Import components & constants
import { http, ROOT_STORAGE } from '../constants';

// Import types & other action creators
import { pullProjects } from './FeedbackActions';
import {
  SAVE_EMAIL,
  SENDING_AUTHORIZATION_EMAIL,
  SENT_AUTHORIZATION_EMAIL,
  AUTHORIZING_USER,
  AUTHORIZE_USER_SUCCESS,
  AUTHORIZE_USER_FAIL,
  LOAD_STATE_SUCCESS,
  EMAIL_SAVE_SUCCESS,
  TOKEN_SAVE_SUCCESS,
  LOG_OUT_USER,
} from './types';

export const authorizeUserFail = error => (
  {
    type: AUTHORIZE_USER_FAIL,
    payload: error,
  }
);

export const loadStateSuccess = () => (
  {
    type: LOAD_STATE_SUCCESS,
  }
);

export const sendAuthorizationEmail = (email, navigateToNext) => (
  (dispatch) => {
    dispatch({ type: SENDING_AUTHORIZATION_EMAIL });

    // Add a new user to our database (or update the passcode of the user)
    return http.post('/sendAuthorizationEmail/', { email })
    // If successful navigate to the login in screen (for post email verification)
    .then(() => {
      // Change the in-authorization flag in state so we update the component
      dispatch({ type: SAVE_EMAIL, payload: email });
      dispatch({ type: SENT_AUTHORIZATION_EMAIL });
      navigateToNext();
    })
    .catch((error) => {
      console.error('Error in sendAuthorizationEmail in AuthActions: ', error);
    });
  }
);

export const authorizeUser = (email, code) => (
  (dispatch) => {
    dispatch({ type: AUTHORIZING_USER });

    // Submits the code the user entered from their email
    return http.post('/authorizeUser/', { email, code })
    // If successful store the token, repull state from the database, and set state to logged-in
    .then((response) => {
      const token = String(response.data);
      AsyncStorage.setItem(`${ROOT_STORAGE}token`, token);
      dispatch(pullProjects(token));
      dispatch(authorizeSuccess(token));
    })
    // If not, show an error message
    .catch((error) => {
      console.error('Error in loginUser in AuthActions: ', error);
      dispatch({ type: AUTHORIZE_USER_FAIL, payload: error.message });
    });
  }
);

export const saveEmail = email => (
  (dispatch) => {
    AsyncStorage.setItem(`${ROOT_STORAGE}email`, email)
    .then(() => {
      dispatch({ type: EMAIL_SAVE_SUCCESS });
    });
  }
);

export const saveToken = token => (
  (dispatch) => {
    AsyncStorage.setItem(`${ROOT_STORAGE}token`, token)
    .then(() => {
      dispatch({ type: TOKEN_SAVE_SUCCESS });
    });
  }
);

export const logOut = () => (
  (dispatch) => {
    saveEmail('');
    saveToken('');
    dispatch({ type: LOG_OUT_USER });
  }
);

export const authorizeSuccess = token => ({
  type: AUTHORIZE_USER_SUCCESS,
  payload: token,
});
