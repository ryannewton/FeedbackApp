'use strict';

import { SET_EMAIL } from '../actions/types';

export default function main(state = {}, action) {
	switch (action.type) {
		case SET_EMAIL:
			return Object.assign({}, state, { email: action.payload });
		default:
			return state;
	}
}
