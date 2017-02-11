'use strict';

import { AsyncStorage } from 'react-native';
import axios from 'axios';

import {
	FEEDBACK_CHANGED,
	SET_EMAIL,
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

const ROOT_URL = 'https://stanfordfeedback.com';

export const feedbackChanged = (feedback) => (
	{
		type: FEEDBACK_CHANGED,
		payload: feedback
	}
);

export const submitFeedbackToServer = (text, email, route) => (
	function (dispatch) {
		dispatch({ type: SUBMIT_FEEDBACK });
		const time = new Date(Date.now()).toISOString().slice(0, 10);

		// Post new feedback to server
		return axios.post(`${ROOT_URL}/addFeedback/`, { text, time, email })
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

export const save_email = (email) => {
	AsyncStorage.setItem('@FeedbackApp:email', email);
	return {
		type: SET_EMAIL,
		payload: email
	};
};

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

export const saveProjectChanges = (project) => ({
		type: SAVE_PROJECT_CHANGES,
		payload: project
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
