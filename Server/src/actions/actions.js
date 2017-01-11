import Moment from 'moment';
import fetch from 'isomorphic-fetch'

let actions = {
	
	setUpVotes(upVotes) {

		return {
			type: 'SET_UP_VOTES',
			upVotes
		}

	},

	addUpVote(upVote) {

		return {
			type: 'ADD_UP_VOTE',
			upVote
		}

	},

	removeUpVote(upVote) {

		return {
			type: 'REMOVE_UP_VOTE',
			upVote
		}

	},

	saveProjectChanges(project) {
		
		fetch(`/saveProjectChanges`, {
	  	method: 'POST',
	    headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json',
	    },
	    body: JSON.stringify({
	      project
	    })
    })
    .catch(error => console.error(error));    

		return {
			type: 'SAVE_PROJECT_CHANGES',
			project
		}

	},

	receivedIDForAddProject(id) {
		return {
			type: 'ADD_PROJECT',
			id
		}
	},

	addProject(receivedIDForAddProject) {		
		return function (dispatch) {
	    return fetch(`/addProject`, {
	    	method: 'POST',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json',
	      },
    	})
      .then(response => response.json())
      .then(response => receivedIDForAddProject(response.id))
      .catch(error => console.error(error));
    }        
	},

	deleteProject(id) {

		fetch(`/deleteProject`, {
	  	method: 'POST',
	    headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json',
	    },
	    body: JSON.stringify({
	      id
	    })
    })
    .catch(error => console.error(error));    
		
		return {
			type: 'DELETE_PROJECT',
			id
		}

	},

	requestedFeedback(start_date, end_date) {
		return {
			type: 'REQUESTED_FEEDBACK',
			start_date,
			end_date,			
		}
	},

	receivedFeedback(feedback) {
		return {
			type: 'RECEIVED_FEEDBACK',
			feedback,			
		}
	},

	updateDates(start_date, end_date, requestedFeedback, receivedFeedback) {

	  return function (dispatch) {

	    dispatch(requestedFeedback(start_date, end_date));

	    return fetch(`/pullFeedback`, {
	    	method: 'POST',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json',
	      },
	      body: JSON.stringify({
	        start_date,
	        end_date,
	      }),
    	})
      .then(response => response.json() )
      .then(feedback => dispatch(receivedFeedback(feedback)) )
      .catch(error => console.error(error) );

	  }
	},

	requestedProjects() {
		return {
			type: 'REQUESTED_PROJECTS',
		}
	},

	receivedProjects(projects) {
		return {
			type: 'RECEIVED_PROJECTS',
			projects,			
		}
	},

	pullProjects(requestedProjects, receivedProjects) {

	  return function (dispatch) {

	    dispatch(requestedProjects());

	    return fetch(`/pullProjects`, {
	    	method: 'POST',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json',
	      },
    	})
      .then(response => response.json() )
      .then(projects => dispatch(receivedProjects(projects)) )
      .catch(error => console.error(error) );

	  }
	}
}

export default actions