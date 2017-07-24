// Import action types
import {
  SUBMIT_FEEDBACK_SUCCESS,
  SUBMIT_FEEDBACK_FAIL,
  ADD_FEEDBACK_TO_STATE,
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
  PULL_FEEDBACK_VOTES_SUCCESS,
  ADD_FEEDBACK_UPVOTE,
  ADD_FEEDBACK_DOWNVOTE,
  REMOVE_FEEDBACK_UPVOTE,
  REMOVE_FEEDBACK_DOWNVOTE,
} from './types';

// Import constants
import http from '../../constants';

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
      console.log('Error in pullFeedback in actions_feedback', error.response.data);
      dispatch({ type: AUTHORIZE_USER_FAIL, payload: error.response.data });
    });
  }
);

export const submitFeedbackToServer = (feedbackRequireApproval, text, type, imageURL) => (
  (dispatch, getState) => {
    const token = localStorage.getItem('token');
    let feedback = { text, type, imageURL };

    http.post('/submitFeedback/', { feedback, authorization: token })
    .then((response) => {
      dispatch({ type: SUBMIT_FEEDBACK_SUCCESS });
      if (!feedbackRequireApproval) {
        feedback = { id: response.data.id, text, status: 'new', type, imageURL, upvotes: 0, downvotes: 0, noOpinions: 0, approved: 1, date: Date.now() };
        dispatch({ type: ADD_FEEDBACK_TO_STATE, payload: feedback });
      }
    })
    .catch((error) => {
      console.log('Error in submitFeedbackToServer in actions_feedback', error);
      dispatch({ type: SUBMIT_FEEDBACK_FAIL, payload: error.response.data });
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


export const addFeedbackUpvote = feedback => (
  (dispatch, getState) => {
    dispatch({ type: ADD_FEEDBACK_UPVOTE, payload: feedback });
    const { feedbackUpvotes, feedbackDownvotes } = getState().user;
    // If downvote exists remove it
    if (feedbackDownvotes.includes(feedback.id)) {
      dispatch(removeFeedbackDownvote(feedback));
    }

    const token = getState().auth.token;
    http.post('/submitFeedbackVote', { feedback, upvote: 1, downvote: 0, noOpinion: 0, authorization: token })
    .catch(error => console.log('Error in addFeedbackUpvote in actions_feedback', error.response.data));
  }
);

export const removeFeedbackUpvote = feedback => (
  (dispatch, getState) => {
    dispatch({ type: REMOVE_FEEDBACK_UPVOTE, payload: feedback });
    const { feedbackUpvotes } = getState().user;

    const token = getState().auth.token;
    http.post('/removeFeedbackVote', { feedback, upvote: 1, downvote: 0, noOpinion: 0, authorization: token })
    .catch(error => console.log('Error in removeFeedbackUpvote in actions_feedback', error.response.data));
  }
);

export const addFeedbackDownvote = feedback => (
  (dispatch, getState) => {
    dispatch({ type: ADD_FEEDBACK_DOWNVOTE, payload: feedback });
    const { feedbackDownvotes, feedbackUpvotes } = getState().user;

    // If upvote exists remove it
    if (feedbackUpvotes.includes(feedback.id)) {
      dispatch(removeFeedbackUpvote(feedback));
    }

    const token = getState().auth.token;
    http.post('/submitFeedbackVote', { feedback, upvote: 0, downvote: 1, noOpinion: 0, authorization: token })
    .catch(error => console.log('Error in addFeedbackDownvote in actions_feedback', error.response.data));
  }
);

export const removeFeedbackDownvote = feedback => (
  (dispatch, getState) => {
    dispatch({ type: REMOVE_FEEDBACK_DOWNVOTE, payload: feedback });
    const { feedbackDownvotes } = getState().user;

    const token = localStorage.getItem('token')
    http.post('/removeFeedbackVote', { feedback, upvote: 0, downvote: 1, noOpinion: 0, authorization: token })
    .catch(error => console.log('Error in removeFeedbackDownvote in actions_feedback', error.response.data));
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

export const updateFeedback = ({ feedback }) => (
  (dispatch) => {
    const token = localStorage.getItem('token');
    http.post('/updateFeedback', { authorization: token, feedback})
    .then(() => {
      console.log('updateFeedback() Success')
      dispatch({ type: UPDATE_FEEDBACK, payload: feedback})
    })
    .catch((error) => {
      console.log('updateFeedback() Fail')
      console.log('Error': error)
    })
  }
)

// To be build. Requires new server endpoint
export const rejectFeedback = ({ feedback, message }) => (
  (dispatch) => {
    dispatch({ type: REJECT_FEEDBACK });

    const token = localStorage.getItem('token');
    http.post('/rejectFeedback', { authorization: token, feedback, message })
    .then(() => {
      console.log('rejectFeedback() Success');
      dispatch({ type: REJECT_FEEDBACK_SUCCESS, payload: feedback });
    })
    .catch((error) => {
      console.log('rejectFeedback() Fail');
      console.log('Error: ', error);
      dispatch({ type: REJECT_FEEDBACK_FAIL, payload: feedback });
    });
  }
);

export const submitOfficialReply = ({ feedback, officialReply }) => (
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
  (dispatch) =>
    http.post('/pullGroupInfo', { authorization: token })
    .then((response) => {
      dispatch({ type: PULL_GROUP_INFO, payload: response.data });
    })
    .catch((error) => {
      console.log('Error in pullGroupInfo, Error: ', error.response.data);
    })
);
