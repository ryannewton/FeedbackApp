// Import action types
import {
  PULL_FEATURES,
} from './types';

// Import constants
import { http } from '../constants';

export const pullFeatures = token => (
  dispatch =>
    http.post('/pullFeatures', { authorization: token })
    .then((response) => {
      dispatch({ type: PULL_FEATURES, payload: response.data[0] });
    })
    .catch((error) => {
      console.log('pull features error', error.response.data);
    })
);
