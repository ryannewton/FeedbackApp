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

export const sendInviteEmail = (email, name) => (
  (dispatch, getState) => {
    const { groupName } = getState().group;
    http.post('/sendInviteEmails', { groupName, email, name })
    .catch(() => console.error('/sendInviteEmails failed'))
  }
);

export const createGroup = (groupName, navigateToNext) => (
  (dispatch, getState) => {
    dispatch({ type: CREATING_GROUP });
    http.post('/createGroup', { groupName })
    .then(() => {
      navigateToNext();
      dispatch({ type: CREATED_GROUP });
      const { code, email } = getState().auth;
      dispatch(authorizeUser(email, code, groupName));
    })
    .catch((error) => {
      console.log('Error in createGroup', error);
      dispatch({ type: CREATE_GROUP_FAILED, payload: 'Sorry there was an error creating your group' });
    });
  }
);
