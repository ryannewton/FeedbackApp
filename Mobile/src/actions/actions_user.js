// Import libraries
import { AsyncStorage } from 'react-native';

// Import action types
import {
  CLOSE_INSTRUCTIONS,
  LOAD_INSTRUCTIONS_VIEWED,
  LOAD_SUGGESTION_UPVOTES,
  LOAD_SUGGESTION_DOWNVOTES,
  LOAD_SOLUTION_UPVOTES,
  LOAD_SOLUTION_DOWNVOTES,
  LOAD_DO_NOT_DISPLAY_LIST,
  ADD_TO_DO_NOT_DISPLAY_LIST,
} from './types';

// Import constants
import { ROOT_STORAGE } from '../constants';

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

export const loadSuggestionUpvotes = suggestionUpvotes => (
  {
    type: LOAD_SUGGESTION_UPVOTES,
    payload: suggestionUpvotes,
  }
);

export const loadSuggestionDownvotes = suggestionDownvotes => (
  {
    type: LOAD_SUGGESTION_DOWNVOTES,
    payload: suggestionDownvotes,
  }
);

export const loadSolutionUpvotes = solutionUpvotes => (
  {
    type: LOAD_SOLUTION_UPVOTES,
    payload: solutionUpvotes,
  }
);

export const loadSolutionDownvotes = solutionDownvotes => (
  {
    type: LOAD_SOLUTION_DOWNVOTES,
    payload: solutionDownvotes,
  }
);

export const loadDoNotDisplayList = list => (
  {
    type: LOAD_DO_NOT_DISPLAY_LIST,
    payload: list,
  }
);

export const addToDoNotDisplayList = suggestionId => (
  (dispatch, getState) => {
    dispatch({ type: ADD_TO_DO_NOT_DISPLAY_LIST, payload: suggestionId });
    const { doNotDisplayList } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}doNotDisplayList`, JSON.stringify(doNotDisplayList));
  }
);

