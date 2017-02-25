'use strict';

import { AsyncStorage } from 'react-native';

//Import Libraries
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

//Import actions, reducers, and constants
import * as actions from '../actions';
import Combined_Reducer from './reducer_index.js';
import { ROOT_STORAGE } from '../constants';

//Import Components
import Feedback from '../scenes/feedback.js';
import Projects from '../scenes/projects.js';
import Settings from '../scenes/settings.js';

const placeholderText = 'Enter your feedback here. We will discuss it with the ' +
	'appropriate department head on Monday and get back to you with their response.';

//Sets our initial state (before data is pulled from the server)
const INITIAL_STATE = {
	main: {
		email: "",
		loading: false,
		feedback: placeholderText
	},
	projects: [],
	navigation: {
		tabs: {
			index: 0,
			routes: [
				{key: 'Feedback'},
				{key: 'Projects'},
				{key: 'Settings'},
			],
		},
		// Scenes for the `Feedback` tab.
		Feedback: {
			index: 0,
			routes: [{key: 'Feedback Home', component: Feedback }],
		},
		// Scenes for the `Projects` tab.
		Projects: {
			index: 0,
			routes: [{key: 'Projects Home', component: Projects }],
		},
		// Scenes for the `Settings` tab.
		Settings: {
			index: 0,
			routes: [{key: 'Settings Home', component: Settings }],
		},
	}
};

let store = createStore(
	Combined_Reducer,
	INITIAL_STATE,
	applyMiddleware(thunkMiddleware)
);

async function load_email() {
	try {
		const email = await AsyncStorage.getItem(`${ROOT_STORAGE}email`) || '';
		store.dispatch(actions.emailChanged(email));
	} catch (error) {
	}
}

async function load_upvotes() {
	try {
		let upvotes = await AsyncStorage.getItem(`${ROOT_STORAGE}upvotes`) || [];
		upvotes = JSON.parse(upvotes);
		store.dispatch(actions.loadUpvotes(upvotes));
	} catch (error) {
	}
}

load_email();
load_upvotes();

store.dispatch(actions.pullProjects(actions.requestedProjects, actions.receivedProjects));

export default store;
