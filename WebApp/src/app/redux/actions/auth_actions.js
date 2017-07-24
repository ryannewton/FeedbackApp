import {
  AUTHORIZING_USER,
  AUTHORIZE_USER_SUCCESS,
  AUTHORIZE_USER_FAIL,
  SIGNOUT_USER,
  GROUP_TREE_INFO,
  PULL_FEEDBACK_VOTES_SUCCESS,
  SENDING_AUTHORIZATION_EMAIL,
  SENT_AUTHORIZATION_EMAIL_SUCCESS,
  SAVE_GROUP_CODE,
  SENT_AUTHORIZATION_EMAIL_FAIL,
  NEEDS_GROUP_CODE,
  PULL_SOLUTION_VOTES_SUCCESS,
} from './types';

import http from '../../constants';
import { pullFeedback, pullSolutions } from '../actions';

export const sendAuthorizationEmail = (email, language) => (
  (dispatch) => {
    dispatch({ type: SENDING_AUTHORIZATION_EMAIL });
    // Add a new user to our database (or update the passcode of the user)
    return http.post('/sendAuthorizationEmail/', { email, language })
    // If successful navigate to the login in screen (for post email verification)
    .then((response) => {
      // Change the in-authorization flag in state so we update the component
      dispatch({ type: SENT_AUTHORIZATION_EMAIL_SUCCESS, payload: email });
      dispatch({ type: SAVE_GROUP_CODE, payload: response.data });
    })
    .catch((error) => {
      dispatch({ type: SENT_AUTHORIZATION_EMAIL_FAIL, payload: error.response.data });
    });
  }
);

export const verifyEmail = (email, code) => (
  (dispatch) => {
    return http.post('/verifyEmail', { email, code })
    .then((response) => {
      if (response.data.needsGroupSignupCode) {
        dispatch({ type: NEEDS_GROUP_CODE, payload: code });
      } else if (response.data.token) {
        dispatch(authorizeUserSuccess(String(response.data.token)));
      } else {
        dispatch(authorizeUserFail('Missing token, verifyEmail routine'))};
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
      dispatch(authorizeUserSuccess(String(response.data)));
    })
    // If not, show an error message
    .catch((error) => {
      dispatch(authorizeUserFail(error.response.data));
    });
  }
);

export const pullFeedbackVotes = () => (
  (dispatch) => {
    const token = localStorage.getItem('token')
    http.post('/pullFeedbackVotes', { authorization: token })
    .then((response) => {
      dispatch({ type: PULL_FEEDBACK_VOTES_SUCCESS, payload: response.data})
    })
    .catch((error) => {
      console.log('Error in pullFeedbackVotes', error);
      dispatch(authorizeUserFail(error.response.data || 'Error Authenticating'));
    });
  }
);

export const pullSolutionVotes = () => (
  (dispatch) => {
    console.log('heresdfl;kjads;flkjasd;lkfjasd;flkj')
    const token = localStorage.getItem('token')
    http.post('/pullSolutionVotes', { authorization: token })
    .then((response) => {
      dispatch({ type: PULL_SOLUTION_VOTES_SUCCESS, payload: response.data})
    })
    .catch((error) => {
      console.log('Error in pullFeedbackVotes', error);
      dispatch(authorizeUserFail(error.response.data || 'Error Authenticating'));
    });
  }
);

export const authorizeUserSuccess = token => (
  (dispatch) => {
    dispatch({ type: AUTHORIZE_USER_SUCCESS, payload: token });
    localStorage.setItem('token', token);
    dispatch(pullFeedback(token));
    dispatch(pullSolutions(token));
    dispatch(pullSolutionVotes());
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
