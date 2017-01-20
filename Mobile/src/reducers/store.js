'use strict';

import { AsyncStorage } from 'react-native';

//Import Libraries
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

//Import Actions
import Actions from '../actions/actions.js';

//Import Reducers
import Combined_Reducer from './reducer_index.js';

//Import Components
import Feedback from '../scenes/feedback.js';
import Projects from '../scenes/projects.js';
import Settings from '../scenes/settings.js';

//Sets our initial state (before data is pulled from the server)
const INITIAL_STATE = {
	main: {
		email: "Please set your email",
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
	},
	up_votes: [],
};

let store = createStore(
	Combined_Reducer,
	INITIAL_STATE,
	applyMiddleware(thunkMiddleware)
);

//AsyncStorage.removeItem('@FeedbackApp:email');

async function load_email() {
	try {
		const email = await AsyncStorage.getItem('@FeedbackApp:email') || "Enter email here";
		console.log(email);
		store.dispatch(Actions.save_email(email));
	} catch (error) {
		console.log(error);
	}
}

load_email();

store.dispatch(Actions.pullProjects(Actions.requestedProjects, Actions.receivedProjects));

//console.log("Cookie");
//console.log(JSON.parse(localStorage.getItem('upVotes')) || [0]);
//store.dispatch(Actions.setUpVotes(JSON.parse(localStorage.getItem('upVotes')) || [0]));

export default store;

