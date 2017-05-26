// Import libraries
import { AsyncStorage } from 'react-native';

// Import action types
import {
  LOAD_SOLUTION_UPVOTES,
  RECEIVED_SOLUTION_LIST,
  SOLUTION_CHANGED,
  SUBMIT_SOLUTION,
  SUBMIT_SOLUTION_SUCCESS,
  SUBMIT_SOLUTION_FAIL,
  ADD_SOLUTION_UPVOTE,
  REMOVE_SOLUTION_UPVOTE,
  SAVE_SOLUTION_CHANGES,
  ADD_SOLUTION_TO_STATE,
} from './types';

// Import constants
import { http, ROOT_STORAGE } from '../constants';

export const solutionChanged = solution => (
  {
    type: SOLUTION_CHANGED,
    payload: solution,
  }
);

export const recievedIDForAddSolution = (solutionId, title, projectId) => (
  {
    type: ADD_SOLUTION_TO_STATE,
    solutionId,
    title,
    projectId,
  }
);

export const submitSolutionToServer = (solution, projectId, moderatorApprovalSolutions) => (
  (dispatch, getState) => {
    const token = getState().auth.token;

    dispatch({ type: SUBMIT_SOLUTION });
    http.post('/addSolution', { title: solution, project_id: projectId, authorization: token, moderatorApprovalSolutions })
    .then((response) => {
      if (!moderatorApprovalSolutions) {
        dispatch(recievedIDForAddSolution(response.data.id, solution, projectId));
      }
      dispatch({ type: SUBMIT_SOLUTION_SUCCESS });
    })
    .catch((error) => {
      console.log('Error in submitSolutionToServer in actions_solutions', error.response.data);
      dispatch({ type: SUBMIT_SOLUTION_FAIL, payload: error.response.data });
    });
  }
);

export const receivedSolutionList = solutions => ({
  type: RECEIVED_SOLUTION_LIST,
  payload: solutions,
});

export const pullSolutions = token => (
  (dispatch) => {
    http.post('/pullProjectAdditions', { authorization: token })
    .then((response) => {
      dispatch(receivedSolutionList(response.data));
    })
    .catch((error) => {
      console.log('Error in pullSolutions in actions_solutions', error.response.data);
    });
  }
);

export const saveSolutionChanges = solution => (
  (dispatch, getState) => {
    dispatch({ type: SAVE_SOLUTION_CHANGES, payload: solution });

    const { token } = getState().auth;

    // Save the solution change to the server
    http.post('/saveProjectAdditionChanges', { project_addition: solution, authorization: token })
    .catch((error) => {
      console.log('Error in saveSolutionChanges in actions_solutions', error.response.data);
    });
  }
);

export const addSolutionUpvote = solution => (
  (dispatch, getState) => {
    dispatch({ type: ADD_SOLUTION_UPVOTE, payload: solution });
    const { solutionUpvotes } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}solutionUpvotes`, JSON.stringify(solutionUpvotes));
    dispatch(saveSolutionChanges(solution, 'addUpvote'));
  }
);

export const loadSolutionUpvotes = solutionUpvotes => (
  {
    type: LOAD_SOLUTION_UPVOTES,
    payload: solutionUpvotes,
  }
);

export const removeSolutionUpvote = solution => (
  (dispatch, getState) => {
    dispatch({ type: REMOVE_SOLUTION_UPVOTE, payload: solution });
    const { solutionUpvotes } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}solutionUpvotes`, JSON.stringify(solutionUpvotes));
    dispatch(saveSolutionChanges(solution, 'removeUpvote'));
  }
);
