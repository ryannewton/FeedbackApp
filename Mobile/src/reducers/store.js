'use strict';

import { AsyncStorage } from 'react-native';

//Import Libraries
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

//Import actions
import * as actions from '../actions';

//Import Reducers
import Combined_Reducer from './reducer_index.js';

//Import Components
import Feedback from '../scenes/feedback.js';
import Projects from '../scenes/projects.js';
import Settings from '../scenes/settings.js';

//Sets our initial state (before data is pulled from the server)
const INITIAL_STATE = {
	main: {
		email: "",
		loading: false
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
		const email = await AsyncStorage.getItem('@FeedbackApp:email') || "Enter email here";
		store.dispatch(actions.save_email(email));
	} catch (error) {
	}
}

load_email();

store.dispatch(actions.pullProjects(actions.requestedProjects, actions.receivedProjects));

export default store;
