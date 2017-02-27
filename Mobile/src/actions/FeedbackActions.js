'use strict';

// Import libraries
import axios from 'axios';
import { AsyncStorage } from 'react-native';

// Import action types
import {
	FEEDBACK_CHANGED,
	UPDATE_NAV_STATE,
	ADD_UPVOTE,
	REMOVE_UPVOTE,
	LOAD_USER_UPVOTES,
	SAVE_PROJECT_CHANGES,
	DELETE_PROJECT,
	REQUESTED_PROJECTS,
	RECEIVED_PROJECTS,
	SUBMIT_FEEDBACK,
	SUBMIT_FEEDBACK_SUCCESS,
	SUBMIT_FEEDBACK_FAIL
} from './types';

// Import constants
import { ROOT_URL, ROOT_STORAGE } from '../constants';

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
		return axios.post(`${ROOT_URL}/addFeedback/`, { text: feedback, time, email }, {
			headers: { authorization: getState().auth.token }
		})
		.then((response) => {
			dispatch({ type: SUBMIT_FEEDBACK_SUCCESS, payload: { response, route } });
			console.log("navigate to projects");
			dispatch(navigate(route));
		})
		.catch((error) => {
			console.log("error");
			console.log(error);
			dispatch({ type: SUBMIT_FEEDBACK_FAIL, payload: { error, route } });
			dispatch(navigate(route));
		});
	}
);

export const navigate = (route) => ({
	type: UPDATE_NAV_STATE,
	payload: route
});

export const addUpvote = (project) => (
	(dispatch, getState) => {
		dispatch({ type: ADD_UPVOTE, payload: project });
		const { upvotes } = getState().user;
		AsyncStorage.setItem(`${ROOT_STORAGE}upvotes`, JSON.stringify(upvotes));
		dispatch(saveProjectChanges(project, 'addUpvote'));
	}
);

export const removeUpvote = (project) => (
	(dispatch, getState) => {
		dispatch({ type: REMOVE_UPVOTE, payload: project });
		const { upvotes } = getState().projects;
		AsyncStorage.setItem(`${ROOT_STORAGE}upvotes`, JSON.stringify(upvotes));
		dispatch(saveProjectChanges(project, 'removeUpvote'));
	}
);

export const loadUpvotes = (upvotes) => (
	{
		type: LOAD_USER_UPVOTES,
		payload: upvotes
	}
);

export const saveProjectChanges = (project, changeType) => (
	(dispatch, getState) => {
		dispatch({ type: SAVE_PROJECT_CHANGES, payload: project });

		// Save the project change to the server
		fetch(`${ROOT_URL}/saveProjectChanges`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				authorization: getState().auth.token
			},
			body: JSON.stringify({ project })
		});

		// Subscribe the user to the project
		const { email } = getState().auth;
		addSubscriber(email, project.id, changeType);
	}
);

const addSubscriber = (email, projectId, type) => (
	(dispatch, getState) => {
		axios.post(`${ROOT_URL}/addSubscriber`, { email, projectId, type }, {
			headers: { authorization: getState().auth.token }
		});
	}
);

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
	function (dispatch, getState) {
		dispatch(requestedProjects());

		return axios.post(`${ROOT_URL}/pullProjects`, {
			headers: { authorization: getState().auth.token }
		})
		.then(response => dispatch(receivedProjects(response.data)))
		.catch(error => console.error(error));
	}
);
