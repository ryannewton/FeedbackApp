// Import types & other action creators
import { requestedFeedback } from './actions_main';

import {
  RECEIVED_FEEDBACK, 
} from './types';

// Import constants
import http from '../constants';

// Handle Feedback
export const receivedFeedback = feedback => (
  {
    type: RECEIVED_FEEDBACK,
    feedback,
  }
);

export const updateDates = (startDate, endDate, token) => (
  (dispatch, getState) => {
    dispatch(requestedFeedback(startDate, endDate));

    http.post('/pullFeedback', {
      startDate,
      endDate,
      authorization: token || getState().auth.token,
    })
    .then(response => dispatch(receivedFeedback(response.data)))
    .catch(error => console.log(error));
  }
);
