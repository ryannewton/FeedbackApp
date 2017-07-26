import {
  AUTHORIZING_USER,
  AUTHORIZE_USER_SUCCESS,
  AUTHORIZE_USER_FAIL,
  SIGNOUT_USER,
  GROUP_TREE_INFO
} from './types';

import http from '../constants';
import { pullFeedback, pullSolutions, pullGroupInfo } from '../actions';


export const authorizeUser = ({ email, code }) => (
  (dispatch) => {
    dispatch({ type: AUTHORIZING_USER });

    http.post('/authorizeAdministrator/', { email, code })
    .then((response) => {
      const token = String(response.data);
      dispatch(authorizeUserSuccess(token));
      dispatch(pullFeedback(token));
      dispatch(pullSolutions(token));
      //dispatch(pullGroupTreeInfo(token));
      dispatch(pullGroupInfo(token));
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
    localStorage.setItem('token', token);
  }
);

export const pullGroupTreeInfo = token => (
  (dispatch) => {
    http.post('/getGroupTreeData', { authorization: token})
    .then((response) => {
      dispatch({ type: GROUP_TREE_INFO, payload: response.data });
    })
    .catch((error) => {
      console.log(error)
    });
  }
)

export const authorizeUserFail = error => ({
  type: AUTHORIZE_USER_FAIL,
  payload: error,
});

export const signoutUser = () => (
  (dispatch) => {
    dispatch({ type: SIGNOUT_USER });
    localStorage.removeItem('token');
  }
);
