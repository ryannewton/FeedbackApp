// Import Libraries
import { AsyncStorage } from 'react-native';

// Import actions, reducers, and constants
import store from './store';
import * as actions from '../actions';
import { ROOT_STORAGE } from '../constants';

async function loadToken() {
  try {
    const token = await AsyncStorage.getItem(`${ROOT_STORAGE}token`) || null;
    store.dispatch(actions.pullProjects(token));
    store.dispatch(actions.pullSolutions(token));
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
    let doNotDisplayList = await AsyncStorage.getItem(`${ROOT_STORAGE}doNotDisplayList`) || '[]';
    doNotDisplayList = JSON.parse(doNotDisplayList);
    store.dispatch(actions.loadDoNotDisplayList(doNotDisplayList));
  } catch (error) {
    console.log(error);
  }
}

// Initialize saved state
const loadOnLaunch = () => {
  Promise.all([
    loadUpvotes(),
    loadDoNotDisplayList(),
    loadToken(),
  ])
  .then(() => {
    store.dispatch(actions.loadStateSuccess());
  });
};

export default loadOnLaunch;
