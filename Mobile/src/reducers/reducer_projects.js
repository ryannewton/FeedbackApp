'use strict';

// Import action types
import {
	REQUESTED_PROJECTS,
	RECEIVED_PROJECTS,
	SAVE_PROJECT_CHANGES,
	ADD_UPVOTE,
	REMOVE_UPVOTE
} from '../actions/types';

export default (state = [], action) => {
	switch (action.type) {
		case REQUESTED_PROJECTS:
			return state;
		case RECEIVED_PROJECTS:
			return action.payload;
		case SAVE_PROJECT_CHANGES: {
			const index = state.findIndex((project) => project.id === action.payload.id);
			const newState = state.slice(0);
			newState.splice(index, 1, action.payload);
			return newState;
		}
		case ADD_UPVOTE: {
			const index = state.findIndex((project) => project.id === action.payload.id);
			const newState = state.slice(0);
			newState[index].votes += 1;
			return newState;
		}
		case REMOVE_UPVOTE: {
			const index = state.findIndex((project) => project.id === action.payload.id);
			const newState = state.slice(0);
			newState[index].votes -= 1;
			return newState;
		}
		default:
			return state;
	}
};
