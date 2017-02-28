'use strict';

// Import action types
import {
	EMAIL_CHANGED,
	SAVE_EMAIL,
	PASSWORD_CHANGED,
	PASSWORD_CONFIRM_CHANGED,
	SIGNUP_USER,
	SIGNUP_USER_SUCCESS,
	SIGNUP_USER_FAIL,
	LOGIN_USER,
	LOGIN_USER_SUCCESS,
	LOGIN_USER_FAIL,
	LOAD_TOKEN
} from '../actions/types';

const INITIAL_STATE = {
	email: '',
	password: '',
	passwordConfirm: '',
	loading: false,
	token: null,
	error: null
};

const CLEAR_STATE = {
	password: '',
	passwordConfirm: '',
	loading: false,
	error: null
};

export default (state = INITIAL_STATE, action) => {

	switch (action.type) {
		case EMAIL_CHANGED:
			return { ...state, email: action.payload };
		case SAVE_EMAIL:
			return { ...state, email: action.payload };
		case PASSWORD_CHANGED:
			return { ...state, password: action.payload };
		case PASSWORD_CONFIRM_CHANGED:
			return { ...state, passwordConfirm: action.payload };
		case SIGNUP_USER:
			return { ...state, loading: true };
		case SIGNUP_USER_SUCCESS:
			return { ...state, ...CLEAR_STATE, token: action.payload };
		case SIGNUP_USER_FAIL:
			return { ...state, error: action.payload, password: '', passwordConfirm: '', loading: false };
		case LOGIN_USER:
			return { ...state, loading: true };
		case LOGIN_USER_SUCCESS:
			return { ...state, ...CLEAR_STATE, token: action.payload };
		case LOGIN_USER_FAIL:
			return { ...state, error: action.payload, password: '', loading: false };
		case LOAD_TOKEN:
			return { ...state, token: action.payload };
		default:
			return state;
	}
};
