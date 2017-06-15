// Import action types
import {
  SUBMIT_FEEDBACK,
  SUBMIT_FEEDBACK_SUCCESS,
  SUBMIT_FEEDBACK_FAIL,
} from './types';

// Import constants
import { http } from '../constants';

// Import actions
import { addProject } from '../actions';

export const submitFeedbackToServer = (moderatorApproval, feedback, type) => (
  (dispatch, getState) => {
    dispatch({ type: SUBMIT_FEEDBACK });

    // Post new feedback to server
    http.post('/addFeedback/', { text: feedback, type, authorization: getState().auth.token })
    .then((response) => {
      dispatch({ type: SUBMIT_FEEDBACK_SUCCESS });
      if (!moderatorApproval) dispatch(addProject(feedback, type, response.data.id));
    })
    .catch((error) => {
      console.log('Error in submitFeedbackToServer in actions_feedback', error.response.data);
      dispatch({ type: SUBMIT_FEEDBACK_FAIL, payload: error.response.data });
    });
  }
);
