import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTHORIZE_USER,
  AUTHORIZE_USER_SUCCESS,
  AUTHORIZE_USER_FAIL,
  SEND_AUTHORIZATION_EMAIL,
  SEND_AUTHORIZATION_EMAIL_SUCCESS,
  SEND_AUTHORIZATION_EMAIL_FAIL,
  SIGNOUT_USER,
} from './types';

import { http } from '../constants';
// const ROOT_URL = 'http://localhost:3090';

export const authorizeUserSuccess = token => (
  (dispatch) => {
    localStorage.setItem('token', token);
    browserHistory.push('/approvefeedback');
    return {
      type: AUTHORIZE_USER_SUCCESS,
      payload: token,
    }
  }
);

export const authorizeUserFail = error => ({
  type: AUTHORIZE_USER_FAIL,
  payload: error,
});

export const sendAuthorizationEmail = (email) => (
  (dispatch) => {
    dispatch({ type: SEND_AUTHORIZATION_EMAIL });

    // Add a new user to our database (or update the passcode of the user)
    return http.post('/sendAuthorizationEmail/', { email })
    // If successful navigate to the login in screen (for post email verification)
    .then(() => {
      // Change the in-authorization flag in state so we update the component
      dispatch({ type: SEND_AUTHORIZATION_EMAIL_SUCCESS, payload: email });
      browserHistory.push('/authorize');
    })
    .catch((error) => {
      dispatch({ type: SEND_AUTHORIZATION_EMAIL_FAIL });
      console.log('sendAuthorizationEmail() fail');
      console.log('error: ', error);
    });
  }
);

export const authorizeUser = (email, authCode, adminCode) => (
  (dispatch) => {
    dispatch({ type: AUTHORIZE_USER });

    // Submits the code the user entered from their email
    return http.post('/authorizeAdminUser/', { email, code: authCode, groupAdminCode: adminCode })
    // If successful store the token, repull state from the database, and set state to logged-in
    .then((response) => {
      const token = String(response.data);
      dispatch(authorizeUserSuccess(token));
    })
    // If not, show an error message
    .catch((error) => {
      console.log('Bag Login Info');
      console.log('error: ', error.response.data);
      dispatch(authorizeUserFail(error.response.data));
    });
  }
);

export const signoutUser = () => (
  (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: SIGNOUT_USER });
  }
);
