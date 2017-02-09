'use strict';

import {
	EMAIL_CHANGED,
	PASSWORD_CHANGED,
	PASSWORD_CONFIRM_CHANGED,
	SIGNUP_USER_FAIL
} from '../actions/types';

const INITIAL_STATE = {
	email: '',
	password: '',
	passwordConfirm: '',
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case EMAIL_CHANGED:
			return { ...state, email: action.payload };
		case PASSWORD_CHANGED:
			return { ...state, password: action.payload };
		case PASSWORD_CONFIRM_CHANGED:
			return { ...state, passwordConfirm: action.payload };
		case SIGNUP_USER_FAIL:
			return { ...state, error: action.payload, password: '', passwordConfirm: '' };
		default:
			return state;
	}
};
