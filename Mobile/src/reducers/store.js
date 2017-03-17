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
import ProjectsTab from '../scenes/projectsTab.js';
import Settings from '../scenes/settings.js';
import New_Projects from '../scenes/new_projects.js';
import Welcome from '../scenes/welcome';

const placeholderText = 'We meet with administrators each week and find solutions to the feedback submitted about their departments';

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
			index: 4,
			routes: [
				{key: 'Feedback', displayName: 'Send Feedback', inTabs: true},
				{key: 'NewProjects', displayName: 'New Projects', inTabs: true},
				{key: 'AllProjects', displayName: 'All Projects', inTabs: true},
				{key: 'Settings', displayName: 'Settings', inTabs: false},
				{key: 'Welcome', displayName: 'Welcome', inTabs: false}
			],
		},
		// Scenes for the `Feedback` tab.
		Feedback: {
			index: 0,
			routes: [{key: 'Feedback Home', component: Feedback }],
		},
		// Scenes for the `ProjectsTab` tab.
		AllProjects: {
			index: 0,
			routes: [{key: 'Projects Home', component: ProjectsTab }],
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
		Welcome: {
			index: 0,
			routes: [{key: 'Welcome Home', component: Welcome }]
		}
	}
};

let store = createStore(
	Combined_Reducer,
	INITIAL_STATE,
	applyMiddleware(thunkMiddleware)
);

async function load_token_and_email() {
	try {
		const token = await AsyncStorage.getItem(`${ROOT_STORAGE}token`) || null;
		store.dispatch(actions.loadToken(token));
		const email = await AsyncStorage.getItem(`${ROOT_STORAGE}email`) || '';
		store.dispatch(actions.saveEmail(email));
		store.dispatch(actions.pullProjects(token, email));
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
	}
}

async function load_doNotDisplayList() {
	try {
		let doNotDisplayList = await AsyncStorage.getItem(`${ROOT_STORAGE}doNotDisplayList`) || [];
		doNotDisplayList = JSON.parse(doNotDisplayList);
		store.dispatch(actions.loadDoNotDisplayList(doNotDisplayList));
	} catch (error) {
	}
}

// Initialize saved state
load_upvotes();
load_doNotDisplayList();
load_token_and_email()
	.then(() => {
		const token = store.getState().auth.token;
		// If token is stored on device, flag that user is logged in
		if(token) {
			store.dispatch(actions.authorizeSuccess(token));
		}

		// Redirect to Feedback scene after asyncStorage is loaded to state
		store.dispatch(actions.navigate({ type: 'selectTab', tabKey: 'Feedback' }));
	});

export default store;
