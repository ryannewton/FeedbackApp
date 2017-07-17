import {
  AUTHORIZING_USER,
  AUTHORIZE_USER_SUCCESS,
  AUTHORIZE_USER_FAIL,
  SIGNOUT_USER,
} from './types';

import http, { ROOT_STORAGE } from '../../constants';


export const authorizeUser = ({ email, code }) => (
  (dispatch) => {
    dispatch({ type: AUTHORIZING_USER });

    http.post('/authorizeAdministrator/', { email, code })
    .then((response) => {
      const token = String(response.data);
      dispatch(authorizeUserSuccess(token));
    })
    .catch((error) => {
      console.log('error in authorizeUser: ', error);
      dispatch(authorizeUserFail(error.response.data || 'Error Authenticating'));
    });
  }
);

export const authorizeUserSuccess = token => (
  (dispatch) => {
    dispatch({ type: AUTHORIZE_USER_SUCCESS, payload: token });
    localStorage.setItem(`${ROOT_STORAGE}token`, token);
  }
);

export const authorizeUserFail = error => ({
  type: AUTHORIZE_USER_FAIL,
  payload: error,
});

export const signoutUser = () => (
  (dispatch) => {
    dispatch({ type: SIGNOUT_USER });
    localStorage.removeItem(`${ROOT_STORAGE}token`);
  }
);
