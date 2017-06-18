// Import action types
import {
  REQUESTED_SUGGESTIONS,
  RECEIVED_SUGGESTIONS,
  SUBMITTING_SUGGESTION,
  SUBMIT_SUGGESTION_SUCCESS,
  SUBMIT_SUGGESTION_FAIL,
  SUBMIT_IMAGE,
  SUBMIT_IMAGE_SUCCESS,
  SUBMIT_IMAGE_FAIL,
  ADD_SUGGESTION_UPVOTE,
  ADD_SUGGESTION_DOWNVOTE,
  REMOVE_SUGGESTION_UPVOTE,
  REMOVE_SUGGESTION_DOWNVOTE,
  AUTHORIZE_USER_SUCCESS,
  AUTHORIZE_USER_FAIL,
} from './types';

// Import constants
import { http, ROOT_URL } from '../constants';

export const pullSuggestions = token => (
  (dispatch) => {
    dispatch({ type: REQUESTED_SUGGESTIONS });

    http.post('/pullSuggestions', { authorization: token })
    .then((response) => {
      dispatch({ type: AUTHORIZE_USER_SUCCESS, payload: token });
      dispatch({ type: RECEIVED_SUGGESTIONS, payload: { list: response.data, lastPulled: new Date() }});
    })
    .catch((error) => {
      console.log('Error in pullSuggestions in actions_suggestions', error.response.data);
      dispatch({ type: AUTHORIZE_USER_FAIL, payload: error.response.data });
    });
  }
);

export const submitSuggestionToServer = (suggestionsRequireApproval, text, type, imageURL) => (
  (dispatch, getState) => {
    dispatch({ type: SUBMITTING_SUGGESTION });

    const token = getState().auth.token;
    let suggestion = { text, type, imageURL };

    http.post('/submitSuggestion/', { suggestion, authorization: token })
    .then((response) => {
      dispatch({ type: SUBMIT_SUGGESTION_SUCCESS });
      if (!suggestionsRequireApproval) {
        suggestion = { id: response.data.id, text, status: 'new', type, imageURL, approved: 1 };
        dispatch({ type: ADD_SUGGESTION_TO_STATE, payload: suggestion });
      }
    })
    .catch((error) => {
      console.log('Error in submitSuggestionToServer in actions_suggections', error.response.data);
      dispatch({ type: SUBMIT_SUGGESTION_FAIL, payload: error.response.data });
    });
  }
);

export const addSuggestionUpvote = suggestion => (
  (dispatch, getState) => {
    dispatch({ type: ADD_SUGGESTION_UPVOTE, payload: suggestion });
    const { suggestionUpvotes, suggestionDownvotes } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}suggestionUpvotes`, JSON.stringify(suggestionUpvotes));

    //If downvote exists remove it
    if (suggestionDownvotes.includes(suggestion.id)) {
      dispatch(removeSuggestionDownvote(suggestion));
    }

    http.post('/submitSuggestionVote', { suggestion, upvote: 1, downvote: 0, authorization: token })
    .catch((error) => console.log('Error in addSuggestionUpvote in actions_suggestions', error.response.data));
  }
);


export const removeSuggestionUpvote = suggestion => (
  (dispatch, getState) => {
    dispatch({ type: REMOVE_SUGGESTION_UPVOTE, payload: suggestion });
    const { suggestionUpvotes } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}suggestionUpvotes`, JSON.stringify(suggestionUpvotes));
    
    http.post('/removeSuggestionVote', { suggestion, upvote: 1, downvote: 0, authorization: token })
    .catch((error) => console.log('Error in removeSuggestionUpvote in actions_suggestions', error.response.data));
  }
);

export const addSuggestionDownvote = suggestion => (
  (dispatch, getState) => {
    dispatch({ type: ADD_SUGGESTION_DOWNVOTE, payload: suggestion });
    const { suggestionDownvotes, suggestionUpvotes } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}suggestionDownvotes`, JSON.stringify(suggestionDownvotes));
    
    //If upvote exists remove it
    if (suggestionUpvotes.includes(suggestion.id)) {
      dispatch(removeSuggestionUpvote(suggestion));
    }
    
    http.post('/submitSuggestionVote', { suggestion, upvote: 0, downvote: 1, authorization: token })
    .catch((error) => console.log('Error in addSuggestionDownvote in actions_suggestions', error.response.data));
  }
);

export const removeSuggestionDownvote = suggestion => (
  (dispatch, getState) => {
    dispatch({ type: REMOVE_SUGGESTION_DOWNVOTE, payload: suggestion });
    const { suggestionDownvotes } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}suggestionDownvotes`, JSON.stringify(suggestionDownvotes));
        
    http.post('/removeSuggestionVote', { suggestion, upvote: 0, downvote: 1, authorization: token })
    .catch((error) => console.log('Error in removeSuggestionDownvote in actions_suggestions', error.response.data));
  }
);

export const uploadImage = uri => (
  (dispatch) => {
    dispatch({ type: SUBMIT_IMAGE });
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
    .then(response => dispatch({ type: SUBMIT_IMAGE_SUCCESS, payload: response.location }))
    .catch((err) => {
      dispatch({ type: SUBMIT_IMAGE_FAIL });
      alert('Uh-oh, something went wrong :(\nPlease try again.');
      console.log('Error uploading image');
      console.log('Error: ', err);
    });
  }
);

