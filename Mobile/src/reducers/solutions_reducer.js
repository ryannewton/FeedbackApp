'use strict';

// Import action types
import {
	RECEIVED_SOLUTION_LIST,
	SUBMIT_SOLUTION,
	SUBMIT_SOLUTION_SUCCESS,
	SUBMIT_SOLUTION_FAIL
} from '../actions/types';

const INITIAL_STATE = {
	allSolutions: [],
	message: '',
	loading: false
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case RECEIVED_SOLUTION_LIST:
			return { ...state, allSolutions: action.payload };
		case SUBMIT_SOLUTION:
			console.log('SUBMIT_SOLUTION run');
			return { ...state, loading: true, message: '' };
		case SUBMIT_SOLUTION_SUCCESS:
			return { ...state, loading: false, message: 'Solution successfully submitted' };
		case SUBMIT_SOLUTION_FAIL:
			return { ...state, loading: false, message: 'Error. Please try again later' };
		default:
			return state;
	}
};
