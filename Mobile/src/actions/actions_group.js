// Import action types
import {
  PULL_GROUP_INFO,
  UPDATE_INVITE_EMAILS,
  SET_GROUP_NAME
} from './types';

// Import constants
import { http } from '../constants';
import { authorizeUser } from './actions_auth';

export const pullGroupInfo = token => (
  dispatch =>
    http.post('/pullGroupInfo', { authorization: token })
    .then((response) => {
      dispatch({ type: PULL_GROUP_INFO, payload: response.data });
    })
    .catch((error) => {
      console.log('Error in pullGroupInfo, Error: ', error.response.data);
    })
);

export const updateInviteEmails = emails => (
  {
    type: UPDATE_INVITE_EMAILS,
    payload: emails,
  }
);

export const sendInviteEmails = (emails) => (
  (dispatch, getState) => {
    const { groupName } = getState().group;
    http.post('/sendInviteEmails', { groupName, emails })
    .then(() => {
      console.log('Sent Emails!');
    });
  }
);

export const createGroup = (groupName, navigateToNext) => (
  (dispatch, getState) =>
    http.post('/createGroup', { groupName })
    .then(() => {
      const { code, email } = getState().auth;
      dispatch(authorizeUser(email, code, groupName));
      navigateToNext();
    })
    .catch((error) => {
      console.log('Error running /createGroup');
      console.log('Error: ', error);
      console.log('Write a dispatch()');
    })
);
