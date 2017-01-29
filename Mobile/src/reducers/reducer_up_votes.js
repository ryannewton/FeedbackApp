'use strict';

// Import action types
import { SET_UP_VOTES, ADD_UP_VOTE, REMOVE_UP_VOTE } from '../actions/types';

export default (state = [], action) => {
	switch (action.type) {
		case SET_UP_VOTES:
			return action.payload;
		case ADD_UP_VOTE:
			// *****What does the splice do?*****
			return state.splice(state.length-1, 0, action.payload);
		case REMOVE_UP_VOTE:
			return state.filter((id) => id !== action.payload);
		default:
			return state;
	}
};
