'use strict';

// Import libraries
import axios from 'axios';

// Import action types
import {
	REQUESTED_PROJECTS,
	RECEIVED_PROJECTS,
	SAVE_PROJECT_CHANGES
} from '../actions/types';

const ROOT_URL = 'https://stanfordfeedback.com';

export default (state = [], action) => {
	switch (action.type) {
		case REQUESTED_PROJECTS:
			return state;
		case RECEIVED_PROJECTS:
			return action.payload;
		case SAVE_PROJECT_CHANGES:
			saveProjectChanges(action.payload);
			const index = state.findIndex((project) => project.id === action.payload.id);
			const newState = state.slice(0);
			newState.splice(index, 1, action.project);
			return newState;
		default:
			return state;
	}
};

// const saveProjectChanges = (project) => {
// 	fetch('https://stanfordfeedback.com/saveProjectChanges', {
// 		method: 'POST',
// 		headers: {
// 			Accept: 'application/json',
// 			'Content-Type': 'application/json',
// 		},
// 		body: JSON.stringify({
// 			project
// 		})
// 	});
// };

const saveProjectChanges = (project) => {
	console.log('POST request initiated to /saveProjectChanges');
	console.log('body is: ', project);
	axios.post(`${ROOT_URL}/saveProjectChanges`, project)
	.then((res) => {
		console.log('saveProjectChange successful. Response: ', res);
	})
	.catch((err) => {
		console.log('saveProjectChange FAIL. Response: ', err);
	});
};
