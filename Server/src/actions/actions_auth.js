// Import types & other action creators
import { updateDates } from './actions_feedback';
import { pullProjects } from './actions_projects';
import { pullProjectAdditions } from './actions_projectAdditions';
import { loadProjectUpvotes, loadSolutionUpvotes } from './actions_user';

import {
  SENDING_AUTHORIZATION_EMAIL,
  SENT_AUTHORIZATION_EMAIL,
  AUTHORIZING_USER,
  AUTHORIZE_USER_SUCCESS,
  AUTHORIZE_USER_FAIL,
} from './types';

// Import constants
import http from '../constants';

export const authorizeUserFail = error => (
  {
    type: AUTHORIZE_USER_FAIL,
    payload: error,
  }
);

export const sendAuthorizationEmail = email => (
  (dispatch) => {
    dispatch({ type: SENDING_AUTHORIZATION_EMAIL });

    // Add a new user to our database (or update the passcode of the user)
    return http.post('/sendAuthorizationEmail/', { email })
    // If successful navigate to the login in screen (for post email verification)
    .then(() => {
      // Change the in-authorization flag in state so we update the component
      dispatch({ type: SENT_AUTHORIZATION_EMAIL });
    })
    .catch((error) => {
      console.log('Error in sendAuthorizationEmail in AuthActions');
      console.log(error);
    });
  }
);

export const authorizeUser = (email, code, adminCode) => (
  (dispatch) => {
    dispatch({ type: AUTHORIZING_USER });

    // Submits the code the user entered from their email
    return http.post('/authorizeAdminUser/', { email, code, adminCode })
    // If successful store the token, repull state from the database, and set state to logged-in
    .then((response) => {
      const token = String(response.data);
      localStorage.setItem('token', token);
      dispatch(pullProjects(token));
      dispatch({ type: AUTHORIZE_USER_SUCCESS, payload: token });
    })
    // If not, show an error message
    .catch((error) => {
      console.log('Error in loginUser in AuthActions');
      console.log(error);
      dispatch({ type: AUTHORIZE_USER_FAIL, payload: error.message });
    });
  }
);

export const loadData = (token) => (
  (dispatch, getState) => {

    //Add a post to test the token

    const time = new Date(Date.now()).toISOString().slice(0, 10);
    const token = token || getState().auth.token;
    dispatch(updateDates('2016-11-01', time, token));
    dispatch(pullProjects(token));
    dispatch(pullProjectAdditions(token));
    dispatch(loadProjectUpvotes(JSON.parse(localStorage.getItem('projectUpvotes')) || [0]));
    //store.dispatch(actions.loadSolutionUpvotes(JSON.parse(localStorage.getItem('solutionUpvotes')) || [0]));
  }
);
