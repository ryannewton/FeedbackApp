// Import Libraries
import { createStore, applyMiddleware } from 'redux';
import { AsyncStorage } from 'react-native';
import thunkMiddleware from 'redux-thunk';

// Import actions, reducers, and constants
import * as actions from '../actions';
import Combined_Reducer from './reducer_index.js';
import { ROOT_STORAGE } from '../constants';

let store = createStore(
  Combined_Reducer,
  applyMiddleware(thunkMiddleware),
);

async function load_token() {
  try {
    const token = await AsyncStorage.getItem(`${ROOT_STORAGE}token`) || null;
    store.dispatch(actions.pullProjects(token));
    store.dispatch(actions.pullSolutions(token));
  } catch (error) {
    console.log(error);
  }
}

async function load_upvotes() {
  try {
    // Project Upvotes
    let projectUpvotes = await AsyncStorage.getItem(`${ROOT_STORAGE}upvotes`) || [];
    projectUpvotes = JSON.parse(projectUpvotes);
    store.dispatch(actions.loadProjectUpvotes(projectUpvotes));

    // Solution Upvotes
    let solutionUpvotes = await AsyncStorage.getItem(`${ROOT_STORAGE}solutionUpvotes`) || [];
    solutionUpvotes = JSON.parse(solutionUpvotes);
    store.dispatch(actions.loadSolutionUpvotes(solutionUpvotes));
  } catch (error) {
    console.log(error);
  }
}

async function load_doNotDisplayList() {
  try {
    let doNotDisplayList = await AsyncStorage.getItem(`${ROOT_STORAGE}doNotDisplayList`) || [];
    doNotDisplayList = JSON.parse(doNotDisplayList);
    store.dispatch(actions.loadDoNotDisplayList(doNotDisplayList));
  } catch (error) {
    console.log(error);
  }
}

// Initialize saved state
load_upvotes();
load_doNotDisplayList();
load_token();

export default store;
