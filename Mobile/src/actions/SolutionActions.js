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
    projectId
  }
);

export const submitSolutionToServer = (solution, project_id) => (
  function (dispatch, getState) {
    const token = getState().auth.token;

    dispatch({ type: SUBMIT_SOLUTION });
    return http.post('/addSolution', { title: solution, project_id, authorization: token })
      .then((response) => {
        dispatch(recievedIDForAddSolution(response.data.id, solution, project_id));
        dispatch({ type: SUBMIT_SOLUTION_SUCCESS });
      })
      .catch((err) => {
        dispatch({ type: SUBMIT_SOLUTION_FAIL });
        console.log('submitSolutionToServer() ERROR: ', err);
      });
  }
);

export const pullSolutions = token => (
  function (dispatch) {
    return http.post('/pullProjectAdditions', { authorization: token })
    .then((response) => {
      dispatch(receivedSolutionList(response.data));
    })
    .catch((error) => {
      console.log('pullSolutions() ERROR: ', error.message);
    });
  }
);

export const receivedSolutionList = solutions => ({
  type: RECEIVED_SOLUTION_LIST,
  payload: solutions,
});

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

export const saveSolutionChanges = (solution, changeType) => (
  (dispatch, getState) => {
    dispatch({ type: SAVE_SOLUTION_CHANGES, payload: solution });

    // Save the solution change to the server
    http.post('/saveProjectAdditionChanges', { project_addition: solution, authorization: getState().auth.token }, {
      headers: { authorization: getState().auth.token },
    });

    // Subscribe the user to the project
    // const { token } = getState().auth;
    // http.post('/addSubscriber', { authorization: token, id: solution.id, type: changeType });
  }
);
