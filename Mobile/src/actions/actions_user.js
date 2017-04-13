// Import libraries
import { AsyncStorage } from 'react-native';

// Import action types
import {
  CLOSE_INSTRUCTIONS,
  LOAD_INSTRUCTIONS_VIEWED,
} from './types';

// Import constants
import { ROOT_STORAGE } from '../constants';

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