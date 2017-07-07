// Import Libraries, components & constants
import { AsyncStorage } from 'react-native';
import { http, ROOT_STORAGE } from '../constants';

// Import types & other action creators
import {
  SENDING_AUTHORIZATION_EMAIL,
  SENT_AUTHORIZATION_EMAIL_SUCCESS,
  SENT_AUTHORIZATION_EMAIL_FAIL,
  AUTHORIZING_USER,
  AUTHORIZE_USER_FAIL,
  AUTHORIZE_USER_SUCCESS,
  LOG_OUT_USER,
  SAVE_GROUP_CODE,
} from './types';

// Import functions
import { pullFeedback } from './actions_feedback';
import { pullSolutions } from './actions_solutions';
import { pullGroupInfo } from './actions_group';

export const sendAuthorizationEmail = (email, navigateToNext) => (
  (dispatch) => {
    dispatch({ type: SENDING_AUTHORIZATION_EMAIL });

    // Add a new user to our database (or update the passcode of the user)
    return http.post('/sendAuthorizationEmail/', { email })
    // If successful navigate to the login in screen (for post email verification)
    .then((response) => {
      // Change the in-authorization flag in state so we update the component
      dispatch({ type: SENT_AUTHORIZATION_EMAIL_SUCCESS, payload: email });
      dispatch({ type: SAVE_GROUP_CODE, payload: response.data });
      navigateToNext();
    })
    .catch((error) => {
      dispatch({ type: SENT_AUTHORIZATION_EMAIL_FAIL, payload: error.response.data });
    });
  }
);

export const authorizeUserFail = error => ({
  type: AUTHORIZE_USER_FAIL,
  payload: error,
});

export const authorizeUserSuccess = token => (
  (dispatch) => {
    dispatch(pullFeedback(token));
    dispatch(pullSolutions(token));
    dispatch(pullGroupInfo(token));
    return { type: AUTHORIZE_USER_SUCCESS, payload: token };
  }
);

export const authorizeUser = (email, code, groupAuthCode) => (
  (dispatch) => {
    dispatch({ type: AUTHORIZING_USER });

    // Submits the code the user entered from their email
    return http.post('/authorizeUser/', { email, code, groupAuthCode })
    // If successful store the token, repull state from the database, and set state to logged-in
    .then((response) => {
      const token = String(response.data);
      AsyncStorage.setItem(`${ROOT_STORAGE}token`, token)
      .then(() => {
        dispatch(authorizeUserSuccess(token));
      });
    })
    // If not, show an error message
    .catch((error) => {
      dispatch(authorizeUserFail(error.response.data));
    });
  }
);

export const logOut = () => (
  (dispatch) => {
    AsyncStorage.removeItem(`${ROOT_STORAGE}token`)
    .then(() => {
      dispatch({ type: LOG_OUT_USER });
    });
  }
);
