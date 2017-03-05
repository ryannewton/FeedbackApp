'use strict';

// Import libraries
import axios from 'axios';

// Import action types
import {
	RECEIVED_SUGGESTIONS,
	SUBMIT_SOLUTION_SUCCESS
} from './types';

// Import constants
import { ROOT_URL } from '../constants';

export const submitSuggestionToServer = (suggestion, project) => (
	function (dispatch, getState) {
		const token = getState().auth.token;

		return axios.post(`${ROOT_URL}/addSolution`, { description: suggestion, projectId: project.id, authorization: token })
			.then(response => {
				console.log('Suggestion submitted SUCCESS');
			});
	}
);

export const pullSuggestions = (project) => (
	function (dispatch, getState) {
		const token = getState().auth.token;

		return axios.post(`${ROOT_URL}/pullProjectAdditions`, { authorization: token })
			.then(response => {
				dispatch(receivedSuggestions(response));
			});
	}
);

export const receivedSuggestions = (suggestions) => ({
	type: RECEIVED_SUGGESTIONS,
	payload: suggestions
});
