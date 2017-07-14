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
  NEEDS_GROUP_CODE,
} from './types';

// Import functions
import loadOnLaunch from '../reducers/load_on_launch';

export const sendAuthorizationEmail = (email, navigateToNext, language) => (
  (dispatch) => {
    console.log(language)
    dispatch({ type: SENDING_AUTHORIZATION_EMAIL });

    // Add a new user to our database (or update the passcode of the user)
    return http.post('/sendAuthorizationEmail/', { email, language })
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
    loadOnLaunch();
    return { type: AUTHORIZE_USER_SUCCESS, payload: token };
  }
);

export const verifyEmail = (email, code) => (
  (dispatch) => {
    dispatch({ type: VERIFYING_EMAIL });

    return http.post('/verifyEmail', { email, code })
    .then((response) => {
      if (response.data.needsGroupSignupCode) {
        dispatch({ type: NEEDS_GROUP_CODE, payload: code });
      } else if (response.data.token) {
        const token = String(response.data.token);
        AsyncStorage.setItem(`${ROOT_STORAGE}token`, token)
        .then(() => {
          dispatch(authorizeUserSuccess(token));
        });
      } else dispatch(authorizeUserFail('Missing token, verifyEmail routine'));
    })
    .catch((error) => {
      dispatch(authorizeUserFail(error.response.data));
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
