// Import action types
import {
  PULL_GROUP_INFO,
  UPDATE_INVITE_EMAILS,
} from './types';

// Import constants
import { http } from '../constants';

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

export const sendInviteEmails = (emails) => {
  (dispatch, getState) => {
    const { groupId } = getState().group;
    http.post('/sendInviteEmails', { groupId, emails })
    .then(() => {
      console.log('Sent Emails!');
    });
  };
}

export const createGroup = (groupName, navigateToNext) => {
  dispatch =>
    http.post('/createGroup', { groupName })
    .then(() => {
      navigateToNext();
    })
    .catch((error) => {
      console.log('Error running /createGroup');
      console.log('Error: ', error);
      console.log('Write a dispatch()');
    });
};
