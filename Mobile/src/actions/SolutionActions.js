'use strict';

// Import libraries
import axios from 'axios';

// Import action types
import {
	RECEIVED_SOLUTION,
	SUBMIT_SOLUTION_SUCCESS
} from './types';

// Import constants
import { ROOT_URL } from '../constants';

export const submitSolutionToServer = (solution, project) => (
	function (dispatch, getState) {
		const token = getState().auth.token;

		return axios.post(`${ROOT_URL}/addSolution`, { description: solution, projectId: project.id, authorization: token })
			.then(response => {
				console.log('Solution submitted SUCCESS');
			});
	}
);

export const pullSolutions = () => (
	function (dispatch, getState) {
		const token = getState().auth.token;

		return axios.post(`${ROOT_URL}/pullProjectAdditions`, { authorization: token })
			.then(response => {
				dispatch(receivedSolutions(response));
			});
	}
);

export const receivedSolutions = (solutions) => ({
	type: RECEIVED_SOLUTION,
	payload: solutions
});
