'use strict';

// Import action types
import {
	REQUESTED_PROJECTS,
	RECEIVED_PROJECTS,
	SAVE_PROJECT_CHANGES,
	ADD_PROJECT,
	DELETE_PROJECT
} from '../actions/types';

export default function projects(state = [], action) {
	switch (action.type) {
		case REQUESTED_PROJECTS:
			return state;
		case RECEIVED_PROJECTS:
			return action.payload;
		case SAVE_PROJECT_CHANGES:
			const index = state.findIndex((project) => project.id === action.payload);
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
			return state.filter((project) => project.id !== action.payload);
		default:
			return state;
	}
}
