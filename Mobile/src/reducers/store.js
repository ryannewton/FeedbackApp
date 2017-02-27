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
import New_Projects from '../scenes/new_projects.js';

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
				{key: 'Feedback', displayName: 'Send Feedback', inTabs: true},
				{key: 'NewProjects', displayName: 'New Projects', inTabs: true},
				{key: 'AllProjects', displayName: 'All Projects', inTabs: true},
				{key: 'Settings', displayName: 'Settings', inTabs: false},				
			],
		},
		// Scenes for the `Feedback` tab.
		Feedback: {
			index: 0,
			routes: [{key: 'Feedback Home', component: Feedback }],
		},
		// Scenes for the `Projects` tab.
		AllProjects: {
			index: 0,
			routes: [{key: 'Projects Home', component: Projects }],
		},
		// Scenes for the `Settings` tab.
		Settings: {
			index: 0,
			routes: [{key: 'Settings Home', component: Settings }],
		},
		// Scenes for the 'New Projects' tab.
		NewProjects: {
			index: 0,
			routes: [{key: 'New Projects Home', component: New_Projects }],
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

async function load_token() {
	try {
		let token = await AsyncStorage.getItem(`${ROOT_STORAGE}token`) || null;
		store.dispatch(actions.loadToken(token));
	} catch (error) {
	}
}

load_email();
load_upvotes();
load_token();



async function load_doNotDisplayList() {
	try {
		const doNotDisplayList = await AsyncStorage.getItem(`${ROOT_STORAGE}doNotDisplayList`) || '';
		console.log("loading list", doNotDisplayList);
		store.dispatch(actions.loadDoNotDisplayList(doNotDisplayList));
	} catch (error) {
	}
}

load_doNotDisplayList();


store.dispatch(actions.pullProjects(actions.requestedProjects, actions.receivedProjects));

export default store;
