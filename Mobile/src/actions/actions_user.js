// Import libraries
import { AsyncStorage } from 'react-native';

// Import action types
import {
  ADD_PROJECT_UPVOTE,
  REMOVE_PROJECT_UPVOTE,
  LOAD_PROJECT_UPVOTES,
  CLOSE_INSTRUCTIONS,
  LOAD_INSTRUCTIONS_VIEWED,
  ADD_TO_DO_NOT_DISPLAY_LIST,
  LOAD_DO_NOT_DISPLAY_LIST,
  REMOVE_PROJECT_DOWNVOTE,
  ADD_PROJECT_DOWNVOTE,
  LOAD_PROJECT_DOWNVOTES,
} from './types';

// Import constants
import { ROOT_STORAGE } from '../constants';

// Import actions
import { saveProjectChanges } from '../actions';

// Handle Upvoting
export const closeInstructions = instructionKey => (
  (dispatch, getState) => {
    dispatch({ type: CLOSE_INSTRUCTIONS, payload: instructionKey });
    const { instructionsViewed } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}instructionsViewed`, JSON.stringify(instructionsViewed));
  }
);

export const loadInstructionsViewed = list => (
  {
    type: LOAD_INSTRUCTIONS_VIEWED,
    payload: list,
  }
);

export const addProjectUpvote = project => (
  (dispatch, getState) => {
    dispatch({ type: ADD_PROJECT_UPVOTE, payload: project });
    const { projectUpvotes, projectDownvotes } = getState().user;
    if (projectDownvotes.includes(project.id)) {
      dispatch(removeProjectDownvote(project));
      // projectDownvotes.splice(projectDownvotes.indexOf(project.id), 1);
    }
    AsyncStorage.setItem(`${ROOT_STORAGE}projectUpvotes`, JSON.stringify(projectUpvotes));
    AsyncStorage.setItem(`${ROOT_STORAGE}upvotes`, JSON.stringify(projectUpvotes));
    dispatch(saveProjectChanges(project, 'add project upvote'));
  }
);


export const removeProjectUpvote = project => (
  (dispatch, getState) => {
    dispatch({ type: REMOVE_PROJECT_UPVOTE, payload: project });
    const { projectUpvotes } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}projectUpvotes`, JSON.stringify(projectUpvotes));
    AsyncStorage.setItem(`${ROOT_STORAGE}upvotes`, JSON.stringify(projectUpvotes));
    dispatch(saveProjectChanges(project, 'remove project upvote'));
  }
);

export const addProjectDownvote = project => (
  (dispatch, getState) => {
    dispatch({ type: ADD_PROJECT_DOWNVOTE, payload: project });
    const { projectDownvotes, projectUpvotes } = getState().user;
    if (projectUpvotes.includes(project.id)) {
      dispatch(removeProjectUpvote(project));
    }
    AsyncStorage.setItem(`${ROOT_STORAGE}projectDownvotes`, JSON.stringify(projectDownvotes));
    AsyncStorage.setItem(`${ROOT_STORAGE}downvotes`, JSON.stringify(projectDownvotes));
    dispatch(saveProjectChanges(project, 'add project downvote'));
  }
);

export const removeProjectDownvote = project => (
  (dispatch, getState) => {
    dispatch({ type: REMOVE_PROJECT_DOWNVOTE, payload: project });
    const { projectDownvotes } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}projectDownvotes`, JSON.stringify(projectDownvotes));
    AsyncStorage.setItem(`${ROOT_STORAGE}downvotes`, JSON.stringify(projectDownvotes));
    dispatch(saveProjectChanges(project, 'remove project downvote'));
  }
);

export const loadProjectUpvotes = projectUpvotes => (
  {
    type: LOAD_PROJECT_UPVOTES,
    payload: projectUpvotes,
  }
);

export const loadProjectDownvotes = projectDownvotes => (
  {
    type: LOAD_PROJECT_DOWNVOTES,
    payload: projectDownvotes,
  }
);

export const addToDoNotDisplayList = projectID => (
  (dispatch, getState) => {
    dispatch({ type: ADD_TO_DO_NOT_DISPLAY_LIST, payload: projectID });
    const { doNotDisplayList } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}doNotDisplayList`, JSON.stringify(doNotDisplayList));
  }
);

export const loadDoNotDisplayList = list => (
  {
    type: LOAD_DO_NOT_DISPLAY_LIST,
    payload: list,
  }
);
