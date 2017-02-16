'use strict';

// Import action types
import {
	REQUESTED_PROJECTS,
	RECEIVED_PROJECTS,
	SAVE_PROJECT_CHANGES,
	ADD_UP_VOTE,
	REMOVE_UP_VOTE
} from '../actions/types';

export default (state = [], action) => {
	const index = state.findIndex((project) => project.id === action.payload.id);
	let newState = state.slice(0);

	switch (action.type) {
		case REQUESTED_PROJECTS:
			return state;
		case RECEIVED_PROJECTS:
			return action.payload;
		case SAVE_PROJECT_CHANGES:
			newState.splice(index, 1, action.payload);
			return newState;
		case ADD_UP_VOTE:
			newState[index].votes += 1;
			return newState;
		case REMOVE_UP_VOTE:
			newState[index].votes -= 1;
			return newState;
		default:
			return state;
	}
};
