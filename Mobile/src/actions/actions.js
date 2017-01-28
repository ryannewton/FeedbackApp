'use strict';
import { AsyncStorage } from 'react-native';

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
			type: 'SET_EMAIL',
			email
		};
	},

	navigate(action) {		
		return {
			type: 'UPDATE_NAV_STATE',
			action
		};
	},
	
	setUpVotes(upVotes) {
		return {
			type: 'SET_UP_VOTES',
			upVotes
		};
	},

	addUpVote(upVote) {
		localStorage.setItem('upVotes', JSON.stringify(ops.push(action.upVote, state)));
		console.log(JSON.stringify(ops.push(action.upVote, state)));

		return {
			type: 'ADD_UP_VOTE',
			upVote
		};
	},

	removeUpVote(upVote) {
		localStorage.setItem('upVotes', JSON.stringify((ops.filter((id) => { return id !== action.upVote; }, state))));
			console.log(JSON.stringify(ops.filter((id) => { return id !== action.upVote; }, state)));

		return {
			type: 'REMOVE_UP_VOTE',
			upVote
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
    .then(response => console.log(response))
    .catch(error => console.error(error));    		

		return {
			type: 'SAVE_PROJECT_CHANGES',
			project
		};
	},

	receivedIDForAddProject(id) {
		console.log('ran');
		return {
			type: 'ADD_PROJECT',
			id
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
    })
    .then(response => console.log(response))
    .catch(error => console.error(error));    
		
		return {
			type: 'DELETE_PROJECT',
			id
		};
	},

	requestedProjects() {
		return {
			type: 'REQUESTED_PROJECTS',
		};
	},

	receivedProjects(projects) {
		return {
			type: 'RECEIVED_PROJECTS',
			projects,			
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
