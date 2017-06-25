// Import action types
import {
  REQUEST_FEEDBACK,
  REQUEST_FEEDBACK_SUCCESS,
  AUTHORIZE_USER_SUCCESS,
  AUTHORIZE_USER_FAIL,
} from './types';

// Import constants
import { http } from '../constants';

export const pullFeedback = () => (
  (dispatch) => {
    const token = localStorage.getItem('token');
    dispatch({ type: REQUEST_FEEDBACK });
    console.log('POST request to /pullFeedback');

    http.post('/pullFeedback', { authorization: token })
    .then((response) => {
      console.log('Successfully received response in pullFeedback()');
      dispatch({ type: AUTHORIZE_USER_SUCCESS, payload: token });
      const lastPulled = new Date();
      dispatch({ type: REQUEST_FEEDBACK_SUCCESS, payload: { list: response.data, lastPulled } });
    })
    .catch((error) => {
      console.log('Error in pullFeedback in actions_feedback', error.response.data);
      dispatch({ type: AUTHORIZE_USER_FAIL, payload: error.response.data });
    });
  }
);
