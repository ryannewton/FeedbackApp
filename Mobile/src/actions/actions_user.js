// Import libraries
import { AsyncStorage } from 'react-native';
import Expo from 'expo';

// Import action types
import {
  CLOSE_INSTRUCTIONS,
  LOAD_INSTRUCTIONS_VIEWED,
  LOAD_FEEDBACK_UPVOTES,
  LOAD_FEEDBACK_DOWNVOTES,
  LOAD_FEEDBACK_NO_OPINIONS,
  LOAD_SOLUTION_UPVOTES,
  LOAD_SOLUTION_DOWNVOTES,
  LOAD_DO_NOT_DISPLAY_LIST,
  ADD_TO_DO_NOT_DISPLAY_LIST,
  CHANGE_LANGUAGE_CHOICE,
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

export const loadFeedbackUpvotes = feedbackUpvotes => (
  {
    type: LOAD_FEEDBACK_UPVOTES,
    payload: feedbackUpvotes,
  }
);

export const loadFeedbackDownvotes = feedbackDownvotes => (
  {
    type: LOAD_FEEDBACK_DOWNVOTES,
    payload: feedbackDownvotes,
  }
);

export const loadFeedbackNoOpinions = feedbackNoOpinions => (
  {
    type: LOAD_FEEDBACK_NO_OPINIONS,
    payload: feedbackNoOpinions,
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

export const addToDoNotDisplayList = feedbackId => (
  (dispatch, getState) => {
    dispatch({ type: ADD_TO_DO_NOT_DISPLAY_LIST, payload: feedbackId });
    const { doNotDisplayList } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}doNotDisplayList`, JSON.stringify(doNotDisplayList));
  }
);

export const languageChoice = language => (
  {
    type: CHANGE_LANGUAGE_CHOICE,
    payload: language,
  }
)


export const sendGoogleAnalytics = (page, groupID = 0, feedbackID = 0) => (
  (dispatch) => {
    const options = {
      method: 'POST',
      headers: {
        'User-Agent': 'SuggestionBox',
      },
    };

    const googleURL = 'https://www.google-analytics.com/collect?v=1&t=screenview&tid=UA-99660629-1&cid=' + String(Expo.Constants.deviceId) + '&cd=' + String(page) + '&cd1=' + String(groupID) + '&cd2=' + String(feedbackID) + '&an=Suggestion%20Box'
    fetch(googleURL, options)
      .catch(error => console.log('Error caught in sendGoogleAnalytics', error ))
  }
);
