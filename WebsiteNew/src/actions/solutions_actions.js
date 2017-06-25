// Import action types
import {
  REQUEST_SOLUTIONS,
  REQUEST_SOLUTIONS_SUCCESS,
} from './types';

// Import constants
import { http } from '../constants';

export const pullSolutions = () => (
  (dispatch) => {
    const token = localStorage.getItem('token');
    dispatch({ type: REQUEST_SOLUTIONS });
    console.log('POST request to /pullSolutions');
    http.post('/pullSolutions', { authorization: token })
    .then((response) => {
      console.log('Successfully received response in pullFeedback()');
      const lastPulled = new Date();
      dispatch({ type: REQUEST_SOLUTIONS_SUCCESS, payload: { list: response.data, lastPulled } });
    })
    .catch((error) => {
      console.log('Error running pullSolutions()');
      console.log('Error: ', error);
    });
  }
);
