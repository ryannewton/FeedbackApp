'use strict';

// Import action types
import {
	ADD_UP_VOTE,
	REMOVE_UP_VOTE,
	LOAD_USER_UPVOTES
} from '../actions/types';

const INITIAL_STATE = {
	upvotes: []
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ADD_UP_VOTE:
			return { ...state, upvotes: [...state.upvotes, action.payload.id] };
		case REMOVE_UP_VOTE:
			return { ...state, upvotes: removeItem(state.upvotes, action.payload.id) };
		case LOAD_USER_UPVOTES:
			return { ...state, upvotes: action.payload };
		default:
			return state;
	}
};

const removeItem = (arr, item) => {
	const index = arr.indexOf(item);
	if (index !== -1) {
		return [...arr.slice(0, index), ...arr.slice(index + 1)];
	}
	return arr;
};
