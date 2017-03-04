'use strict';

// Import action types
import {
	SAVE_EMAIL,
	SENDING_AUTHORIZATION_EMAIL,
	SENT_AUTHORIZATION_EMAIL,
	AUTHORIZING_USER,
	AUTHORIZE_USER_SUCCESS,
	AUTHORIZE_USER_FAIL,
	LOAD_TOKEN
} from '../actions/types';

const INITIAL_STATE = {
	email: '',
	token: null,
	loading: false,
	sentAuthorizationEmail: false,
	error: null,
	loggedIn: false
};

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {
		case SAVE_EMAIL:
			return { ...state, email: action.payload };
		case SENDING_AUTHORIZATION_EMAIL:
			return { ...state, loading: true };
		case SENT_AUTHORIZATION_EMAIL:
			return { ...state, sentAuthorizationEmail: true, loading: false };
		case AUTHORIZING_USER:
			return { ...state, loading: true };
		case AUTHORIZE_USER_SUCCESS:
			return { ...state, sentAuthorizationEmail: false, loading: false, loggedIn: true, token: action.payload, error: false };
		case AUTHORIZE_USER_FAIL:
			return { ...state, loading: false, loggedIn: false, error: action.payload };
		case LOAD_TOKEN:
			return { ...state, token: action.payload };
		default:
			return state;
	}
};
