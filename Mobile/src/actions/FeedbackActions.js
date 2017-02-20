'use strict';

// Import libraries
import axios from 'axios';

// Import action types
import {
	FEEDBACK_CHANGED,
	UPDATE_NAV_STATE,
	SET_UP_VOTES,
	ADD_UP_VOTE,
	REMOVE_UP_VOTE,
	SAVE_PROJECT_CHANGES,
	DELETE_PROJECT,
	REQUESTED_PROJECTS,
	RECEIVED_PROJECTS,
	SUBMIT_FEEDBACK,
	SUBMIT_FEEDBACK_SUCCESS,
	SUBMIT_FEEDBACK_FAIL
} from './types';

import { ROOT_URL } from '../constants';

export const feedbackChanged = (feedback) => (
	{
		type: FEEDBACK_CHANGED,
		payload: feedback
	}
);

export const submitFeedbackToServer = (route) => (
	function (dispatch, getState) {
		const { feedback } = getState().main;
		const { email } = getState().auth;
		const time = new Date(Date.now()).toISOString().slice(0, 10);

		dispatch({ type: SUBMIT_FEEDBACK });

		// Post new feedback to server
		return axios.post(`${ROOT_URL}/addFeedback/`, { text: feedback, time, email })
		.then((response) => {
			dispatch({ type: SUBMIT_FEEDBACK_SUCCESS, payload: { response, route } });
			dispatch(navigate(route));
		})
		.catch((error) => {
			dispatch({ type: SUBMIT_FEEDBACK_FAIL, payload: { error, route } });
			dispatch(navigate(route));
		});
	}
);

export const navigate = (route) => ({
	type: UPDATE_NAV_STATE,
	payload: route
});

export const setUpVotes = (upVotes) => ({
	type: SET_UP_VOTES,
	payload: upVotes
});

export const addUpVote = (upVote) => ({
	type: ADD_UP_VOTE,
	payload: upVote
});

export const removeUpVote = (upVote) => ({
	type: REMOVE_UP_VOTE,
	payload: upVote
});

export const saveProjectChanges = (project, change_type) => ({
	type: SAVE_PROJECT_CHANGES,
	payload: project,
	change_type
});

export const deleteProject = (id) => ({
	type: DELETE_PROJECT,
	payload: id
});

export const requestedProjects = () => ({
	type: REQUESTED_PROJECTS
});

export const receivedProjects = (projects) => ({
	type: RECEIVED_PROJECTS,
	payload: projects
});

// To Do: Convert `${ROOT_URL}/pullProjects` to GET on server
export const pullProjects = () => (
	function (dispatch) {
		dispatch(requestedProjects());

		return axios.post(`${ROOT_URL}/pullProjects`)
		.then(response => dispatch(receivedProjects(response.data)))
		.catch(error => console.error(error));
	}
);
