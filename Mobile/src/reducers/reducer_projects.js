'use strict';

// Import action types
import {
	REQUESTED_PROJECTS,
	RECEIVED_PROJECTS,
	SAVE_PROJECT_CHANGES,
	ADD_PROJECT,
	DELETE_PROJECT
} from '../actions/types';

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
		case ADD_PROJECT:
			return state.splice(state.length-1, 0, {
				id: action.payload,
				title: 'Blank Title',
				description: 'Blank Description',
				votes: 0
			});
		case DELETE_PROJECT:
			deleteProject(action.payload);
			return state.filter((project) => project.id !== action.payload);
		default:
			return state;
	}
};

const deleteProject = (id) => {
	fetch('/deleteProject', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ id })
	});
};

const saveProjectChanges = (project) => {
	fetch('https://stanfordfeedback.com/saveProjectChanges', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			project
		})
	});
};

const addProject = (receivedIDForAddProject) => {
	return function (dispatch) {
		return fetch('/addProject', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		})
		.then(response => response.json())
		.then(response => receivedIDForAddProject(response.id))
		.catch(error => console.error(error));
	};
};
