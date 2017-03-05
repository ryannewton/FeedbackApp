'use strict';

// Import libraries
import axios from 'axios';

// Import action types
import {
	RECEIVED_SOLUTION,
	SOLUTION_CHANGED
} from './types';

// Import constants
import { ROOT_URL } from '../constants';

export const solutionChanged = (solution) => (
	{
		type: SOLUTION_CHANGED,
		payload: solution
	}
);

export const submitSolutionToServer = (solution, projectId) => (
	function (dispatch, getState) {
		const token = getState().auth.token;

		return axios.post(`${ROOT_URL}/addSolution`, { description: solution, projectId, authorization: token })
			.then(() => {
				// To do: Provide user feedback that the solution was received
				console.log('Solution submitted SUCCESS');
			});
	}
);

export const pullSolutions = () => (
	function (dispatch, getState) {
		const token = getState().auth.token;

		return axios.post(`${ROOT_URL}/pullProjectAdditions`, { authorization: token })
		.then(response => {
			dispatch(receivedSolutions(response.data));
		})
		.catch(error => {
			console.error('pullSolutions() ERROR: ', error);
		});
	}
);

export const receivedSolutions = (solutions) => ({
	type: RECEIVED_SOLUTION,
	payload: solutions
});
