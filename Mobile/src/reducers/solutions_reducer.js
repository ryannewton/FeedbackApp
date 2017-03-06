'use strict';

// Import action types
import {
	RECEIVED_SOLUTION
} from '../actions/types';

export default (state = [], action) => {
	switch (action.type) {
		case RECEIVED_SOLUTION:
			return action.payload;
		default:
			return state;
	}
};
