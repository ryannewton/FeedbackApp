// Import Libraries, components & constants
import { AsyncStorage } from 'react-native';
import { http, ROOT_STORAGE } from '../constants';

// Import types & other action creators
import {
  SENDING_AUTHORIZATION_EMAIL,
  SENT_AUTHORIZATION_EMAIL_SUCCESS,
  SENT_AUTHORIZATION_EMAIL_FAIL,
  AUTHORIZING_USER,
  VERIFYING_EMAIL,
  AUTHORIZE_USER_FAIL,
  AUTHORIZE_USER_SUCCESS,
  LOG_OUT_USER,
  SAVE_GROUP_CODE,
  UPDATE_NEEDS_GROUP_CODE,
  UPDATE_AUTH_CODE,
} from './types';
import errorHandling from '../errorHandling';

// Import functions
import loadOnLaunch from '../reducers/load_on_launch';

export const sendAuthorizationEmail = (email, navigateToNext, language) => (
  (dispatch) => {
    dispatch({ type: SENDING_AUTHORIZATION_EMAIL });

    // Add a new user to our database (or update the passcode of the user)
    return http.post('/sendAuthorizationEmail/', { email, language })
    // If successful navigate to the login in screen (for post email verification)
    .then((response) => {
      // Change the in-authorization flag in state so we update the component
      dispatch(sendAuthorizationEmailSuccess(email));
      dispatch({ type: SAVE_GROUP_CODE, payload: response.data });
      if (email.includes('gymboree')) {
        dispatch(updateNeedsGroupCode(false));
        dispatch(updateAuthCode(9911));
      }
      navigateToNext();
    })
    .catch((error) => {
      dispatch(sendAuthorizationEmailFail(errorHandling(error, 'sendAuthorizationEmail()')));
    });
  }
);

export const sendAuthorizationEmailFail = error => ({
  type: SENT_AUTHORIZATION_EMAIL_FAIL,
  payload: error,
});

export const sendAuthorizationEmailSuccess = email => ({
  type: SENT_AUTHORIZATION_EMAIL_SUCCESS,
  payload: email,
});

export const authorizeUserFail = error => ({
  type: AUTHORIZE_USER_FAIL,
  payload: error,
});

export const authorizeUserSuccess = token => (
  () => {
    loadOnLaunch(token);
    return { type: AUTHORIZE_USER_SUCCESS, payload: token };
  }
);

export const verifyEmail = () => (
  (dispatch, getState) => {
    dispatch({ type: VERIFYING_EMAIL });
    const { email, code } = getState().auth;

    return http.post('/verifyEmail', { email, code })
    .then((response) => {
      if (response.data.needsGroupSignupCode) {
        dispatch(updateNeedsGroupCode(true));
      } else if (response.data.token) {
        const token = String(response.data.token);
        AsyncStorage.setItem(`${ROOT_STORAGE}token`, token)
        .then(() => {
          dispatch(authorizeUserSuccess(token));
        });
      } else {
        console.log('Error in verifyEmail()');
        console.log('Error: Missing token');
        dispatch(authorizeUserFail('Something went wrong on our end. Please try again.'));
      }
    })
    .catch((error) => {
      dispatch(authorizeUserFail(errorHandling(error, 'verifyEmail()')));
    });
  }
);

export const authorizeUser = (email, code, groupSignupCode) => (
  (dispatch) => {
    dispatch({ type: AUTHORIZING_USER });

    // Submits the code the user entered from their email
    return http.post('/authorizeUser/', { email, code, groupSignupCode })
    // If successful store the token, repull state from the database, and set state to logged-in
    .then((response) => {
      const token = String(response.data);
      AsyncStorage.setItem(`${ROOT_STORAGE}token`, token)
      .then(() => {
        dispatch(authorizeUserSuccess(token));
      });
    })
    // If not, show an error message
    .catch(error => dispatch(authorizeUserFail(errorHandling(error, 'authorizeUser()'))));
  }
);

export const updateAuthCode = code => ({
  type: UPDATE_AUTH_CODE,
  payload: code,
});

export const updateNeedsGroupCode = needsGroupCode => ({
  type: UPDATE_NEEDS_GROUP_CODE,
  payload: needsGroupCode,
});

export const logOut = () => (
  (dispatch) => {
    AsyncStorage.removeItem(`${ROOT_STORAGE}token`)
    .then(() => {
      dispatch({ type: LOG_OUT_USER });
    });
  }
);
