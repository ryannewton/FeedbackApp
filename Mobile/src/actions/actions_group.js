// Import action types
import {
  PULL_GROUP_INFO,
  UPDATE_INVITE_EMAILS,
  CREATING_GROUP,
  CREATED_GROUP,
  CREATE_GROUP_FAILED,
} from './types';

// Import constants
import { http } from '../constants';
import { authorizeUser } from './actions_auth';
import errorHandling from '../errorHandling';

export const pullGroupInfo = token => (
  dispatch =>
    http.post('/pullGroupInfo', { authorization: token })
    .then(response => dispatch({ type: PULL_GROUP_INFO, payload: response.data }))
    .catch(error => errorHandling(error, 'pullGroupInfo()'))
);

export const updateInviteEmails = emails => (
  {
    type: UPDATE_INVITE_EMAILS,
    payload: emails,
  }
);

export const sendInviteEmail = (email, name) => (
  (dispatch, getState) => {
    const { groupName } = getState().group;
    http.post('/sendInviteEmails', { groupName, email, name })
    .catch(error => errorHandling(error, 'sendInviteEmail()'))
  }
);

export const sendWelcomeEmail = email => (
  (dispatch, getState) => {
    const { groupName } = getState().group;
    http.post('/sendWelcomeEmail', { groupName, email })
    .catch(error => errorHandling(error, 'sendWelcomeEmail()'))
  }
);

export const createGroup = (groupName, email, navigateToNext) => (
  (dispatch, getState) => {
    dispatch({ type: CREATING_GROUP });
    http.post('/createGroup', { groupName, email })
    .then(() => {
      navigateToNext();
      dispatch({ type: CREATED_GROUP });
      const { code, email } = getState().auth;
      dispatch(authorizeUser(email, code, groupName));
    })
    .catch(error => errorHandling(error, 'createGroup'));
  }
);
