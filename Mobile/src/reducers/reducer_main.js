'use strict';

import {
	FEEDBACK_CHANGED,
	SET_EMAIL,
	SUBMIT_FEEDBACK,
	SUBMIT_FEEDBACK_SUCCESS,
	SUBMIT_FEEDBACK_FAIL,
	SAVE_PROJECT_CHANGES
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
		case SET_EMAIL:
			return { ...state, email: action.payload };
		case SUBMIT_FEEDBACK:
			return { ...state, loading: true };
		case SUBMIT_FEEDBACK_SUCCESS:
			return { ...state, loading: false, feedback: INITIAL_STATE.feedback };
		case SUBMIT_FEEDBACK_FAIL:
			return { ...state, loading: false };
		case SAVE_PROJECT_CHANGES:
			addSubscriber(state.email, action.payload.id, action.type);
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