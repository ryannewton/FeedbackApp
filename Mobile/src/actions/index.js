'use strict';

import { AsyncStorage } from 'react-native';
import axios from 'axios';

import {
	SET_EMAIL,
	UPDATE_NAV_STATE,
	SET_UP_VOTES,
	ADD_UP_VOTE,
	REMOVE_UP_VOTE,
	SAVE_PROJECT_CHANGES,
	DELETE_PROJECT,
	REQUESTED_PROJECTS,
	RECEIVED_PROJECTS,
	SUBMIT_FEEDBACK_SUCCESS,
	SUBMIT_FEEDBACK_FAIL
} from './types';

const ROOT_URL = 'https://stanfordfeedback.com';

const actions = {
	// Is 'feedback' different from a 'project'?
	submitFeedbackToServer(text, email) {
		return function (dispatch) {
			const time = new Date(Date.now()).toISOString().slice(0, 10);

			// Post new feedback to server
			return axios.post(`${ROOT_URL}/addFeedback/`, { text, time, email })
			// Note: Currently no reducer listens to SUBMIT_FEEDBACK_SUCCESS or SUBMIT_FEEDBACK_FAIL
			.then((response) => dispatch({ type: SUBMIT_FEEDBACK_SUCCESS, payload: response }))
			.catch((error) => dispatch({ type: SUBMIT_FEEDBACK_FAIL, payload: error }));
		};
	},

	save_email(email) {
		AsyncStorage.setItem('@FeedbackApp:email', email);
		return {
			type: SET_EMAIL,
			payload: email
		};
	},

	navigate(action) {		
		return {
			type: UPDATE_NAV_STATE,
			payload: action
		};
	},
	
	setUpVotes(upVotes) {
		return {
			type: SET_UP_VOTES,
			payload: upVotes
		};
	},

	addUpVote(upVote) {
		return {
			type: ADD_UP_VOTE,
			payload: upVote
		};
	},

	removeUpVote(upVote) {
		return {
			type: REMOVE_UP_VOTE,
			payload: upVote
		};
	},

	saveProjectChanges(project) {
		return {
			type: SAVE_PROJECT_CHANGES,
			payload: project
		};
	},

	deleteProject(id) {
		return {
			type: DELETE_PROJECT,
			payload: id
		};
	},

	requestedProjects() {
		return {
			type: REQUESTED_PROJECTS
		};
	},

	receivedProjects(projects) {
		return {
			type: RECEIVED_PROJECTS,
			payload: projects
		};
	},

	// To Do: Convert `${ROOT_URL}/pullProjects` to GET on server
	pullProjects(requestedProjects, receivedProjects) {
		return function (dispatch) {
			dispatch(requestedProjects());

			return axios.post(`${ROOT_URL}/pullProjects`)
			.then(response => dispatch(receivedProjects(response.data)))
			.catch(error => console.error(error));
		};
	}
};

export default actions;
