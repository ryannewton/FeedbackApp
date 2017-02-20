'use strict';

// Import libraries
import axios from 'axios';

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
	SAVE_PROJECT_CHANGES
} from '../actions/types';

import { ROOT_URL } from '../constants';

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
		case SAVE_PROJECT_CHANGES:
			console.log("reducer fired in main");
			addSubscriber(state.email, action.payload.id, action.change_type);
			return state;
		default:
			return state;
	}
};

const addSubscriber = (email, project_id, type) => {
	console.log('POST request initiated to /addSubscriber');
	console.log('body is: ', email, project_id, type);
	axios.post(`${ROOT_URL}/addSubscriber`, {email, project_id, type})
	.then((res) => {
		console.log('addSubscriber successful. Response: ', res);
	})
	.catch((err) => {
		console.log('addSubscriber FAIL. Response: ', err);
	});
};