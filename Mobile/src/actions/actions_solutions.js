// Import libraries
import { AsyncStorage } from 'react-native';

// Import action types
import {
  RECEIVED_SOLUTION_LIST,
  SUBMITTING_SOLUTION,
  SUBMIT_SOLUTION_SUCCESS,
  SUBMIT_SOLUTION_FAIL,
  ADD_SOLUTION_TO_STATE,
  ADD_SOLUTION_UPVOTE,
  ADD_SOLUTION_DOWNVOTE,
  REMOVE_SOLUTION_UPVOTE,
  REMOVE_SOLUTION_DOWNVOTE,
  SOLUTION_CHANGED,
} from './types';

// Import constants
import { http, ROOT_STORAGE } from '../constants';

export const pullSolutions = token => (
  (dispatch) => {
    http.post('/pullSolutions', { authorization: token })
    .then((response) => {
      dispatch({ type: RECEIVED_SOLUTION_LIST, payload: response.data });
    })
    .catch((error) => {
      console.log('Error in pullSolutions in actions_solutions', error.response.data);
    });
  }
);

export const submitSolutionToServer = (text, suggestionId, solutionsRequireApproval) => (
  (dispatch, getState) => {
    const token = getState().auth.token;
    let solution = { text, suggestionId };

    dispatch({ type: SUBMITTING_SOLUTION });
    http.post('/submitSolution', { solution, authorization: token })
    .then((response) => {
      dispatch({ type: SUBMIT_SOLUTION_SUCCESS });
      if (!solutionsRequireApproval) {
        solution = { id: response.data.id, suggestionId, text, approved: 1 };
        dispatch({ type: ADD_SOLUTION_TO_STATE, payload: solution });
      }      
    })
    .catch((error) => {
      console.log('Error in submitSolutionToServer in actions_solutions', error.response.data);
      dispatch({ type: SUBMIT_SOLUTION_FAIL, payload: error.response.data });
    });
  }
);

export const addSolutionUpvote = solution => (
  (dispatch, getState) => {
    dispatch({ type: ADD_SOLUTION_UPVOTE, payload: solution });
    const { solutionUpvotes, solutionDownvotes } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}solutionUpvotes`, JSON.stringify(solutionUpvotes));

    // If downvote exists remove it
    if (solutionDownvotes.includes(solution.id)) {
      dispatch(removeSolutionDownvote(solution));
    }
    
    const token = getState().auth.token;
    http.post('/submitSolutionVote', { solution, upvote: 1, downvote: 0, authorization: token })
    .catch((error) => console.log('Error in addSolutionUpvote in actions_solutions', error.response.data));
  }
);

export const addSolutionDownvote = solution => (
  (dispatch, getState) => {
    dispatch({ type: ADD_SOLUTION_DOWNVOTE, payload: solution });
    const { solutionDownvotes, solutionUpvotes } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}solutionDownvotes`, JSON.stringify(solutionDownvotes));

    // If upvote exists remove it
    if (solutionUpvotes.includes(solution.id)) {
      dispatch(removeSolutionUpvote(solution));
    }

    const token = getState().auth.token;
    http.post('/submitSolutionVote', { solution, upvote: 0, downvote: 1, authorization: token })
    .catch((error) => console.log('Error in addSolutionDownvote in actions_solutions', error.response.data));
  }
);

export const removeSolutionUpvote = solution => (
  (dispatch, getState) => {
    dispatch({ type: REMOVE_SOLUTION_UPVOTE, payload: solution });
    const { solutionUpvotes } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}solutionUpvotes`, JSON.stringify(solutionUpvotes));

    const token = getState().auth.token;
    http.post('/removeSolutionVote', { solution, upvote: 1, downvote: 0, authorization: token })
    .catch((error) => console.log('Error in removeSolutionUpvote in actions_solutions', error.response.data));
  }
);

export const removeSolutionDownvote = solution => (
  (dispatch, getState) => {
    dispatch({ type: REMOVE_SOLUTION_DOWNVOTE, payload: solution });
    const { solutionDownvotes } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}solutionDownvotes`, JSON.stringify(solutionDownvotes));

    const token = getState().auth.token;
    http.post('/removeSolutionVote', { solution, upvote: 0, downvote: 1, authorization: token })
    .catch((error) => console.log('Error in removeSolutionDownvote in actions_solutions', error.response.data));
  }
);

export const solutionChanged = solution => (
  {
    type: SOLUTION_CHANGED,
    payload: solution,
  }
);
