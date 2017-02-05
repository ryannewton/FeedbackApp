'use strict';

import {
	SET_EMAIL,
	SUBMIT_FEEDBACK,
	SUBMIT_FEEDBACK_SUCCESS,
	SUBMIT_FEEDBACK_FAIL
} from '../actions/types';

const INITIAL_STATE = {
	loading: false
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SET_EMAIL:
			return { ...state, email: action.payload };
		case SUBMIT_FEEDBACK:
			return { ...state, loading: true };
		case SUBMIT_FEEDBACK_SUCCESS:
			return { ...state, loading: false };
		case SUBMIT_FEEDBACK_FAIL:
			return { ...state, loading: false };
		default:
			return state;
	}
};
