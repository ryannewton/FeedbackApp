// Import libraries
import { AsyncStorage } from 'react-native';

// Import action types
import {
  FEEDBACK_CHANGED,
  SUBMIT_FEEDBACK,
  SUBMIT_FEEDBACK_SUCCESS,
  SUBMIT_FEEDBACK_FAIL,
} from './types';

// Import constants
import { http } from '../constants';

// Import actions
import { addProject } from '../actions';

export const feedbackChanged = feedback => (
  {
    type: FEEDBACK_CHANGED,
    payload: feedback,
  }
);

export const submitFeedbackToServer = moderatorApproval => (
  (dispatch, getState) => {
    dispatch({ type: SUBMIT_FEEDBACK });

    const { feedback } = getState().feedback;

    // Post new feedback to server
    http.post('/addFeedback/', { text: feedback, authorization: getState().auth.token })
    .then((response) => {
      dispatch({ type: SUBMIT_FEEDBACK_SUCCESS });
      if (!moderatorApproval) dispatch(addProject(feedback, response.data.id));
    })
    .catch((error) => {
      console.log('Error in submitFeedbackToServer in FeedbackActions', error.response.data);
      dispatch({ type: SUBMIT_FEEDBACK_FAIL });
    });
  }
);

