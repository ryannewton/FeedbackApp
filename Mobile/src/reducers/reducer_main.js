'use strict';

export default function main(state = {}, action) {
	console.log(state, action);

	switch (action.type) {
		case 'SET_EMAIL':
			return Object.assign({}, state, { email: action.email });
		default:
			return state;
	}
}
