// Import action types
import {
  PULL_GROUP_INFO,
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

export const createGroup = (groupName) => {
  dispatch =>
    http.post('/createGroup', { groupName })
    .then(() => {
      console.log('Fill in rest of action');
    })
    .catch((error) => {
      console.log('Error running /createGroup');
      console.log('Error: ', error);
      console.log('Write a dispatch()');
    });
};
