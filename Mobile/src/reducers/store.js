'use strict';

import { AsyncStorage } from 'react-native';

//Import Libraries
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

//Import actions, reducers, and constants
import * as actions from '../actions';
import Combined_Reducer from './reducer_index.js';
import { ROOT_STORAGE } from '../constants';

	navigation: {
		
	}
};

let store = createStore(
	Combined_Reducer,
	applyMiddleware(thunkMiddleware)
);

async function load_token() {
	try {
		let token = await AsyncStorage.getItem(`${ROOT_STORAGE}token`) || null;
		store.dispatch(actions.pullProjects(token));
		store.dispatch(actions.pullSolutions(token));
	} catch (error) {
		console.log(error);
	}
}

async function load_upvotes() {
	try {
		let upvotes = await AsyncStorage.getItem(`${ROOT_STORAGE}upvotes`) || [];
		upvotes = JSON.parse(upvotes);
		store.dispatch(actions.loadUpvotes(upvotes));
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
