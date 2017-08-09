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
  UPDATE_FEEDBACK_STATUS,
  UPDATE_FEEDBACK,
  PULL_GROUP_INFO,
  REPLY_FEEDBACK_SUCCESS,
  REPLY_FEEDBACK_FAIL,
  ROUTE_FEEDBACK_SUCCESS,
  ROUTE_FEEDBACK_FAIL,
} from './types';

// Import constants
import http from '../constants';

export const pullFeedback = token => (
  (dispatch) => {
    dispatch({ type: REQUEST_FEEDBACK });

    http.post('/pullFeedback', { authorization: token })
    .then((response) => {
      dispatch({ type: AUTHORIZE_USER_SUCCESS, payload: token });
      const lastPulled = new Date();
      dispatch({ type: REQUEST_FEEDBACK_SUCCESS, payload: { list: response.data, lastPulled } });
    })
    .catch((error) => {
      const message = error.response ? error.response.data : error;
      console.log('Error in pullFeedback in actions_feedback', message);
      dispatch({ type: AUTHORIZE_USER_FAIL, payload: message });
    });
  }
);

export const approveFeedback = feedback => (
  (dispatch) => {
    dispatch({ type: APPROVE_FEEDBACK });

    const token = localStorage.getItem('token');
    http.post('/approveFeedback', { authorization: token, feedback })
    .then(() => {
      dispatch({ type: APPROVE_FEEDBACK_SUCCESS, payload: feedback });
    })
    .catch((error) => {
      console.log('approveFeedback() Fail');
      console.log('Error: ', error);
      dispatch({ type: APPROVE_FEEDBACK_FAIL, payload: feedback });
    });
  }
);

// To be build. Requires new server endpoint
export const clarifyFeedback = ({ feedback, message }) => (
  (dispatch) => {
    dispatch({ type: CLARIFY_FEEDBACK });

    const token = localStorage.getItem('token');
    http.post('/clarifyFeedback', { authorization: token, feedback, message })
    .then(() => {
      console.log('clarifyFeedback() Success');
      dispatch({ type: CLARIFY_FEEDBACK_SUCCESS, payload: feedback });
    })
    .catch((error) => {
      console.log('clarifyFeedback() Fail');
      console.log('Error: ', error);
      dispatch({ type: CLARIFY_FEEDBACK_FAIL, payload: error });
    });
  }
);

export const replyFeedback = (feedback, message, type) => (
  (dispatch) => {

    const token = localStorage.getItem('token');
    http.post('/replyFeedback', { authorization: token, feedback, message, type })
    .then(() => {
      console.log('replyFeedback() Success');
      dispatch({ type: REPLY_FEEDBACK_SUCCESS, payload: feedback });
    })
    .catch((error) => {
      console.log('replyFeedback() Fail');
      console.log('Error: ', error);
      dispatch({ type: REPLY_FEEDBACK_FAIL, payload: error });
    });
  }
);

export const routeFeedback = (feedback, email, message) => (
  (dispatch) => {

    const token = localStorage.getItem('token');
    http.post('/routeFeedback', { authorization: token, feedback, message, email })
    .then(() => {
      console.log('routeFeedback() Success');
      dispatch({ type: ROUTE_FEEDBACK_SUCCESS, payload: feedback });
    })
    .catch((error) => {
      console.log('replyFeedback() Fail');
      console.log('Error: ', error);
      dispatch({ type: ROUTE_FEEDBACK_FAIL, payload: error });
    });
  }
);

export const updateFeedback = (feedback) => (
  (dispatch) => {
    const token = localStorage.getItem('token');
    http.post('/updateFeedback', { authorization: token, feedback })
    .then(() => {
      dispatch({ type: UPDATE_FEEDBACK, payload: feedback });
    })
    .catch((error) => {
      console.log('updateFeedback() Fail');
      console.log('Error: ', error);
    });
  }
);

// To be build. Requires new server endpoint
export const rejectFeedback = ({ feedback, message }) => (
  (dispatch) => {
    dispatch({ type: REJECT_FEEDBACK });

    const token = localStorage.getItem('token');
    http.post('/rejectFeedback', { authorization: token, feedback, message })
    .then(() => {
      dispatch({ type: REJECT_FEEDBACK_SUCCESS, payload: feedback });
    })
    .catch((error) => {
      console.log('Error in reject feedback ', error);
      dispatch({ type: REJECT_FEEDBACK_FAIL, payload: feedback });
    });
  }
);

export const submitOfficialReply = (feedback, officialReply) => (
  (dispatch) => {
    dispatch({ type: SUBMIT_OFFICIAL_REPLY });

    const token = localStorage.getItem('token');
    http.post('/submitOfficialReply', { authorization: token, feedback, officialReply })
    .then(() => {
      dispatch({ type: SUBMIT_OFFICIAL_REPLY_SUCCESS, payload: { feedback, officialReply } });
    })
    .catch((error) => {
      console.log('submitOfficialReply() FAIL.');
      console.log('ERROR: ', error);
      dispatch({ type: SUBMIT_OFFICIAL_REPLY_FAIL });
    });
  }
);

export const updateFeedbackStatus = ({ feedback, newStatus }) => (
  (dispatch) => {
    dispatch({
      type: UPDATE_FEEDBACK_STATUS,
      payload: { feedback, status: newStatus },
    });
  }
);

export const pullGroupInfo = token => (
  dispatch =>
    http.post('/pullGroupInfo', { authorization: token })
    .then((response) => {
      dispatch({ type: PULL_GROUP_INFO, payload: response.data });
    })
    .catch((error) => {
      console.log(error);
      console.log('Error in pullGroupInfo, Error: ', error.response.data);
    })
);
