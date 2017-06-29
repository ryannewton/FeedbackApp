// Import libraries
import { AsyncStorage } from 'react-native';

// Import action types
import {
  ADD_FEEDBACK_TO_STATE,
  REQUESTED_FEEDBACK,
  RECEIVED_FEEDBACK,
  SUBMITTING_FEEDBACK,
  SUBMIT_FEEDBACK_SUCCESS,
  SUBMIT_FEEDBACK_FAIL,
  SUBMITTING_IMAGE,
  SUBMIT_IMAGE_SUCCESS,
  SUBMIT_IMAGE_FAIL,
  ADD_FEEDBACK_UPVOTE,
  ADD_FEEDBACK_DOWNVOTE,
  REMOVE_FEEDBACK_UPVOTE,
  REMOVE_FEEDBACK_DOWNVOTE,
  AUTHORIZE_USER_SUCCESS,
  AUTHORIZE_USER_FAIL,
  CHANGE_FILTER_METHOD,
  SET_SEARCH_QUERY,
  SEARCH_IN_PROGRESS,
} from './types';

// Import constants
import { http, ROOT_STORAGE, ROOT_URL } from '../constants';

export const pullFeedback = token => (
  (dispatch) => {
    dispatch({ type: REQUESTED_FEEDBACK });

    http.post('/pullFeedback', { authorization: token })
    .then((response) => {
      dispatch({ type: AUTHORIZE_USER_SUCCESS, payload: token });
      dispatch({ type: RECEIVED_FEEDBACK, payload: { list: response.data, lastPulled: new Date() } });
    })
    .catch((error) => {
      console.log('Error in pullFeedback in actions_feedback', error.response.data);
      dispatch({ type: AUTHORIZE_USER_FAIL, payload: error.response.data });
    });
  }
);

export const submitFeedbackToServer = (feedbackRequireApproval, text, type, imageURL) => (
  (dispatch, getState) => {
    dispatch({ type: SUBMITTING_FEEDBACK });

    const token = getState().auth.token;
    let feedback = { text, type, imageURL };

    http.post('/submitFeedback/', { feedback, authorization: token })
    .then((response) => {
      dispatch({ type: SUBMIT_FEEDBACK_SUCCESS });
      if (!feedbackRequireApproval) {
        feedback = { id: response.data.id, text, status: 'new', type, imageURL, upvotes: 0, downvotes: 0, approved: 1, date: Date.now() };
        dispatch({ type: ADD_FEEDBACK_TO_STATE, payload: feedback });
      }
    })
    .catch((error) => {
      console.log('Error in submitFeedbackToServer in actions_feedback', error);
      dispatch({ type: SUBMIT_FEEDBACK_FAIL, payload: error.response.data });
    });
  }
);

export const addFeedbackUpvote = feedback => (
  (dispatch, getState) => {
    dispatch({ type: ADD_FEEDBACK_UPVOTE, payload: feedback });
    const { feedbackUpvotes, feedbackDownvotes } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}feedbackUpvotes`, JSON.stringify(feedbackUpvotes));

    // If downvote exists remove it
    if (feedbackDownvotes.includes(feedback.id)) {
      dispatch(removeFeedbackDownvote(feedback));
    }

    const token = getState().auth.token;
    http.post('/submitFeedbackVote', { feedback, upvote: 1, downvote: 0, authorization: token })
    .catch(error => console.log('Error in addFeedbackUpvote in actions_feedback', error.response.data));
  }
);


export const removeFeedbackUpvote = feedback => (
  (dispatch, getState) => {
    dispatch({ type: REMOVE_FEEDBACK_UPVOTE, payload: feedback });
    const { feedbackUpvotes } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}feedbackUpvotes`, JSON.stringify(feedbackUpvotes));

    const token = getState().auth.token;
    http.post('/removeFeedbackVote', { feedback, upvote: 1, downvote: 0, authorization: token })
    .catch(error => console.log('Error in removeFeedbackUpvote in actions_feedback', error.response.data));
  }
);

export const addFeedbackDownvote = feedback => (
  (dispatch, getState) => {
    dispatch({ type: ADD_FEEDBACK_DOWNVOTE, payload: feedback });
    const { feedbackDownvotes, feedbackUpvotes } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}feedbackDownvotes`, JSON.stringify(feedbackDownvotes));

    // If upvote exists remove it
    if (feedbackUpvotes.includes(feedback.id)) {
      dispatch(removeFeedbackUpvote(feedback));
    }

    const token = getState().auth.token;
    http.post('/submitFeedbackVote', { feedback, upvote: 0, downvote: 1, authorization: token })
    .catch(error => console.log('Error in addFeedbackDownvote in actions_feedback', error.response.data));
  }
);

export const removeFeedbackDownvote = feedback => (
  (dispatch, getState) => {
    dispatch({ type: REMOVE_FEEDBACK_DOWNVOTE, payload: feedback });
    const { feedbackDownvotes } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}feedbackDownvotes`, JSON.stringify(feedbackDownvotes));

    const token = getState().auth.token;
    http.post('/removeFeedbackVote', { feedback, upvote: 0, downvote: 1, authorization: token })
    .catch(error => console.log('Error in removeFeedbackDownvote in actions_feedback', error.response.data));
  }
);

export const searchInProgress = bool => (
  {
    type: SEARCH_IN_PROGRESS,
    payload: bool,
  }
);

export const changeFilterMethod = method => (
  {
    type: CHANGE_FILTER_METHOD,
    payload: method,
  }
);

export const setSearchQuery = query => (
  {
    type: SET_SEARCH_QUERY,
    payload: query,
  }
);

export const uploadImage = (uri, type) => (
  (dispatch) => {
    dispatch({ type: SUBMITTING_IMAGE });
    const apiUrl = `${ROOT_URL}/uploadPhoto/`;
    const fileType = uri[uri.length - 1];

    const formData = new FormData();
    formData.append('photo', {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });

    const options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };

    fetch(apiUrl, options)
    .then(response => response.json())
    .then(response => dispatch({ type: SUBMIT_IMAGE_SUCCESS, payload: { location: response.location, type } }))
    .catch((err) => {
      dispatch({ type: SUBMIT_IMAGE_FAIL });
      alert('Uh-oh, something went wrong :(\nPlease try again.');
      console.log('Error uploading image');
      console.log('Error: ', err);
    });
  }
);

