'use strict';

import { SET_EMAIL } from '../actions/types';

export default (state = {}, action) => {
	switch (action.type) {
		case SET_EMAIL:
			return { ...state, email: action.payload };
		default:
			return state;
	}
};
