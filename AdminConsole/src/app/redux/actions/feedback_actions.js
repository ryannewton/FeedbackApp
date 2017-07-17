// Import action types
import {
  REQUEST_FEEDBACK,
  REQUEST_FEEDBACK_SUCCESS,
  AUTHORIZE_USER_SUCCESS,
  AUTHORIZE_USER_FAIL,
  APPROVE_FEEDBACK,
  APPROVE_FEEDBACK_SUCCESS,
  APPROVE_FEEDBACK_FAIL,
  CLARIFY_FEEDBACK,
  CLARIFY_FEEDBACK_SUCCESS,
  CLARIFY_FEEDBACK_FAIL,
  REJECT_FEEDBACK,
  REJECT_FEEDBACK_SUCCESS,
  REJECT_FEEDBACK_FAIL,
  SUBMIT_OFFICIAL_REPLY,
  SUBMIT_OFFICIAL_REPLY_SUCCESS,
  SUBMIT_OFFICIAL_REPLY_FAIL,
} from './types';

// Import constants
import http, { ROOT_STORAGE } from '../../constants';

export const pullFeedback = (token) => (
  (dispatch) => {
    console.log('pull Feedback', token);
    dispatch({ type: REQUEST_FEEDBACK });

    http.post('/pullFeedback', { authorization: token })
    .then((response) => {
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

export const approveFeedback = (feedback) => (
  (dispatch) => {
    dispatch({ type: APPROVE_FEEDBACK });

    const token = localStorage.getItem(`${ROOT_STORAGE}token`);
    http.post('/approveFeedback', { authorization: token, feedback })
    .then((response) => {
      dispatch({ type: APPROVE_FEEDBACK_SUCCESS, payload: feedback });
    })
    .catch((error) => {
      console.log('approveFeedback() Fail');
      console.log('Error: ', error);
      dispatch({ type: APPROVE_FEEDBACK_FAIL, payload: feedback });
    })
  }
);

// To be build. Requires new server endpoint
export const clarifyFeedback = (feedback) => (
  (dispatch) => {
    console.log('clarifyFeedback() not functional');
    dispatch({ type: CLARIFY_FEEDBACK });

    const token = localStorage.getItem(`${ROOT_STORAGE}token`);
    // http.post('/updateFeedback', { authorization: token, feedback })
    // .then((response) => {
    //   console.log('clarifyFeedback() Success');
    //   dispatch({ type: CLARIFY_FEEDBACK_SUCCESS, payload: feedback });
    // })
    // .catch((error) => {
    //   console.log('clarifyFeedback() Fail');
    //   console.log('Error: ', error);
    //   dispatch({ type: CLARIFY_FEEDBACK_FAIL, payload: feedback });
    // })
  }
);

// To be build. Requires new server endpoint
export const rejectFeedback = (feedback) => (
  (dispatch) => {
    console.log('rejectFeedback() not functional');
    dispatch({ type: REJECT_FEEDBACK });

    // const token = localStorage.getItem(`${ROOT_STORAGE}token`);
    // http.post('/deleteFeedback', { authorization: token, feedback })
    // .then((response) => {
    //   console.log('rejectFeedback() Success');
    //   dispatch({ type: REJECT_FEEDBACK_SUCCESS, payload: feedback });
    // })
    // .catch((error) => {
    //   console.log('rejectFeedback() Fail');
    //   console.log('Error: ', error);
    //   dispatch({ type: REJECT_FEEDBACK_FAIL, payload: feedback });
    // })
  }
);

export const submitOfficialReply = ({ feedback, officialReply }) => (
  (dispatch) => {
    dispatch({ type: SUBMIT_OFFICIAL_REPLY });

    const token = localStorage.getItem(`${ROOT_STORAGE}token`);
    http.post('/submitOfficialReply', { authorization: token, feedback, officialReply })
    .then((response) => {
      dispatch({ type: SUBMIT_OFFICIAL_REPLY_SUCCESS, payload: { feedback, officialReply } });
    })
    .catch((error) => {
      console.log('submitOfficialReply() FAIL');
      dispatch({ type: SUBMIT_OFFICIAL_REPLY_FAIL });
    });
  }
);
