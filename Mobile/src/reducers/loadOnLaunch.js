// Import Libraries
import { AsyncStorage } from 'react-native';

// Import actions, reducers, and constants
import store from './store';
import * as actions from '../actions';
import { ROOT_STORAGE } from '../constants';

async function loadToken() {
  try {
    // AsyncStorage.removeItem(`${ROOT_STORAGE}token`);
    const token = await AsyncStorage.getItem(`${ROOT_STORAGE}token`) || null;
    if (token === null) {
      store.dispatch(actions.authorizeUserFail());
    } else {
      store.dispatch(actions.pullProjects(token));
      store.dispatch(actions.pullSolutions(token));
      store.dispatch(actions.pullFeatures(token));
    }
  } catch (error) {
    console.log(error);
  }
}

async function loadUpvotes() {
  try {
    // Project Upvotes
    let projectUpvotes = await AsyncStorage.getItem(`${ROOT_STORAGE}upvotes`) || '[]';
    projectUpvotes = JSON.parse(projectUpvotes);
    store.dispatch(actions.loadProjectUpvotes(projectUpvotes));

    // Solution Upvotes
    let solutionUpvotes = await AsyncStorage.getItem(`${ROOT_STORAGE}solutionUpvotes`) || '[]';
    solutionUpvotes = JSON.parse(solutionUpvotes);
    store.dispatch(actions.loadSolutionUpvotes(solutionUpvotes));
  } catch (error) {
    console.log(error);
  }
}

async function loadDoNotDisplayList() {
  try {
    //AsyncStorage.removeItem(`${ROOT_STORAGE}doNotDisplayList`);
    let doNotDisplayList = await AsyncStorage.getItem(`${ROOT_STORAGE}doNotDisplayList`) || '[]';
    doNotDisplayList = JSON.parse(doNotDisplayList);
    store.dispatch(actions.loadDoNotDisplayList(doNotDisplayList));
  } catch (error) {
    console.log(error);
  }
}

async function loadInstructions() {
  try {
    //AsyncStorage.removeItem(`${ROOT_STORAGE}instructionsViewed`);
    let instructionsViewed = await AsyncStorage.getItem(`${ROOT_STORAGE}instructionsViewed`) || '[]';
    instructionsViewed = JSON.parse(instructionsViewed);
    store.dispatch(actions.loadInstructionsViewed(instructionsViewed));
  } catch (error) {
    console.log(error);
  }
}

// Initialize saved state
const loadOnLaunch = () => {
  loadUpvotes();
  loadDoNotDisplayList();
  loadToken();
  loadInstructions();
};

export default loadOnLaunch;
