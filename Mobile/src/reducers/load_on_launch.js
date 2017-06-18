// Import Libraries
import { AsyncStorage } from 'react-native';

// Import actions, reducers, and constants
import store from './store';
import * as actions from '../actions';
import { ROOT_STORAGE } from '../constants';

async function loadToken() {
  try {
    const token = await AsyncStorage.getItem(`${ROOT_STORAGE}token`) || null;
    if (token === null) {
      store.dispatch(actions.authorizeUserFail());
    } else {
      store.dispatch(actions.pullSuggestions(token));
      store.dispatch(actions.pullSolutions(token));
      store.dispatch(actions.pullGroupInfo(token));
    }
  } catch (error) {
    console.log(error);
  }
}

async function loadVotes() {
  try {
    // Suggestion Upvotes
    let suggestionUpvotes = await AsyncStorage.getItem(`${ROOT_STORAGE}suggestionUpvotes`) || '[]';
    suggestionUpvotes = JSON.parse(suggestionUpvotes);
    store.dispatch(actions.loadSuggestionUpvotes(suggestionUpvotes));

    // Suggestion Downvotes
    let suggestionDownvotes = await AsyncStorage.getItem(`${ROOT_STORAGE}suggestionDownvotes`) || '[]';
    suggestionDownvotes = JSON.parse(suggestionDownvotes);
    store.dispatch(actions.loadSuggestionDownvotes(suggestionDownvotes));

    // Solution Upvotes
    let solutionUpvotes = await AsyncStorage.getItem(`${ROOT_STORAGE}solutionUpvotes`) || '[]';
    solutionUpvotes = JSON.parse(solutionUpvotes);
    store.dispatch(actions.loadSolutionUpvotes(solutionUpvotes));

    // Solution Downvotes
    let solutionDownvotes = await AsyncStorage.getItem(`${ROOT_STORAGE}solutionDownvotes`) || '[]';
    solutionDownvotes = JSON.parse(solutionDownvotes);
    store.dispatch(actions.loadSolutionDownvotes(solutionDownvotes));
  } catch (error) {
    console.log(error);
  }
}

async function loadDoNotDisplayList() {
  try {
    let doNotDisplayList = await AsyncStorage.getItem(`${ROOT_STORAGE}doNotDisplayList`) || '[]';
    doNotDisplayList = JSON.parse(doNotDisplayList);
    store.dispatch(actions.loadDoNotDisplayList(doNotDisplayList));
  } catch (error) {
    console.log(error);
  }
}

async function loadInstructions() {
  try {
    let instructionsViewed = await AsyncStorage.getItem(`${ROOT_STORAGE}instructionsViewed`) || '[]';
    instructionsViewed = JSON.parse(instructionsViewed);
    store.dispatch(actions.loadInstructionsViewed(instructionsViewed));
  } catch (error) {
    console.log(error);
  }
}

async function clearAsyncStorage() {
  try {
    await AsyncStorage.removeItem(`${ROOT_STORAGE}token`);
    await AsyncStorage.removeItem(`${ROOT_STORAGE}suggestionUpvotes`);
    await AsyncStorage.removeItem(`${ROOT_STORAGE}suggestionDownvotes`);
    await AsyncStorage.removeItem(`${ROOT_STORAGE}solutionUpvotes`);
    await AsyncStorage.removeItem(`${ROOT_STORAGE}solutionDownvotes`);
    await AsyncStorage.removeItem(`${ROOT_STORAGE}doNotDisplayList`);
    await AsyncStorage.removeItem(`${ROOT_STORAGE}instructionsViewed`);
  } catch (error) {
    console.log(error);
  }
}

// Initialize saved state
const loadOnLaunch = () => {
  // clearAsyncStorage();
  loadToken();
  loadVotes();
  loadDoNotDisplayList();
  loadInstructions();
};

export default loadOnLaunch;
