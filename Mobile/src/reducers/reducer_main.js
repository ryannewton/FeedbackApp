'use strict';

import {
	FEEDBACK_CHANGED,
	SUBMIT_FEEDBACK,
	SUBMIT_FEEDBACK_SUCCESS,
	SUBMIT_FEEDBACK_FAIL
} from '../actions/types';

const placeholderText = 'Enter your feedback here. We will discuss it with the ' +
	'appropriate department head on Monday and get back to you with their response.';

const INITIAL_STATE = {
	loading: false,
	feedback: placeholderText
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case FEEDBACK_CHANGED:
			return { ...state, feedback: action.payload };
		case SUBMIT_FEEDBACK:
			return { ...state, loading: true };
		case SUBMIT_FEEDBACK_SUCCESS:
			return { ...state, loading: false, feedback: INITIAL_STATE.feedback };
		case SUBMIT_FEEDBACK_FAIL:
			return { ...state, loading: false };
		default:
			return state;
	}
};
