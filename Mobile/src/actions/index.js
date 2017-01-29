'use strict';

import { AsyncStorage } from 'react-native';

import {
	SET_EMAIL,
	UPDATE_NAV_STATE,
	SET_UP_VOTES,
	ADD_UP_VOTE,
	REMOVE_UP_VOTE,
	SAVE_PROJECT_CHANGES,
	ADD_PROJECT,
	DELETE_PROJECT,
	REQUESTED_PROJECTS,
	RECEIVED_PROJECTS
} from './types';

const actions = {
	submitFeedbackToServer(text, email) {
		return function (dispatch) {
			const time = new Date(Date.now()).toISOString().slice(0, 10);
			return fetch('https://stanfordfeedback.com/addFeedback/', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					text,
					time,
					email
				}),
			})
			.catch((error) => {
				console.error(error);
			});
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
		localStorage.setItem('upVotes', JSON.stringify(ops.push(action.upVote, state)));

		return {
			type: ADD_UP_VOTE,
			payload: upVote
		};
	},

	removeUpVote(upVote) {
		localStorage.setItem('upVotes', JSON.stringify((ops.filter((id) => { return id !== action.upVote; }, state))));

		return {
			type: REMOVE_UP_VOTE,
			payload: upVote
		};
	},

	saveProjectChanges(project) {
		fetch('https://stanfordfeedback.com/saveProjectChanges', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				project
			})
    })
    .then()
    .catch();    		

		return {
			type: SAVE_PROJECT_CHANGES,
			payload: project.id
		};
	},

	receivedIDForAddProject(id) {
		return {
			type: ADD_PROJECT,
			payload: id
		};
	},

	addProject(receivedIDForAddProject) {
		return function (dispatch) {
			return fetch('/addProject', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			})
      .then(response => response.json())
      .then(response => receivedIDForAddProject(response.id))
      .catch(error => console.error(error));
    };       
	},

	deleteProject(id) {
		fetch('/deleteProject', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id })
		});
		
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

	pullProjects(requestedProjects, receivedProjects) {
		return function (dispatch) {
			dispatch(requestedProjects());

			return fetch('https://stanfordfeedback.com/pullProjects', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			})
			.then(response => response.json())
			.then(projects => dispatch(receivedProjects(projects)))
			.catch(error => console.error(error));
		};
	}
};

export default actions;
