import Moment from 'moment';
import fetch from 'isomorphic-fetch'

let actions = {
	
	//Handle up voting
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


	//Handle project, project_addition changes
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

	saveProjectAdditionChanges(project_addition) {
		
		fetch(`/saveProjectAdditionChanges`, {
	  	method: 'POST',
	    headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json',
	    },
	    body: JSON.stringify({
	      project_addition
	    })
    })
    .catch(error => console.error(error));    

		return {
			type: 'SAVE_PROJECT_ADDITION_CHANGES',
			project_addition
		}
	},


	//Add Project, Solution
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

	receivedIDForAddSolution(project_addition_id, project_id) {
		return {
			type: 'ADD_SOLUTION',
			project_addition_id,
			project_id
		}
	},

	addSolution(project_id, receivedIDForAddSolution) {		
		return function (dispatch) {
	    return fetch(`/addSolution`, {
	    	method: 'POST',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json',
	      },
  	    body: JSON.stringify({
		      project_id
		    })
    	})
      .then(response => response.json())
      .then(response => receivedIDForAddSolution(response.id, project_id))
      .catch(error => console.error(error));
    }        
	},


	//Delete Project, Project_Addition
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

	deleteProjectAddition(id) {

		fetch(`/deleteProjectAddition`, {
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
			type: 'DELETE_PROJECT_ADDITION',
			id
		}
	},


	//Pull Feedback, Projects, Project Additions, Discussions
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

	pullProjects(requestedProjects, receivedProjects, pullProjectAdditions, requestedProjectAdditions, receivedProjectAdditions, pullDiscussionPosts, requestedDiscussionPosts, receivedDiscussionPosts) {

	  return function (dispatch) {

	    dispatch(requestedProjects());
	    dispatch(pullProjectAdditions(requestedProjectAdditions, receivedProjectAdditions));
	    dispatch(pullDiscussionPosts(requestedDiscussionPosts, receivedDiscussionPosts));

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
	},

	requestedProjectAdditions() {
		return {
			type: 'REQUESTED_PROJECT_ADDITIONS',
		}
	},

	receivedProjectAdditions(project_additions) {
		return {
			type: 'RECEIVED_PROJECT_ADDITIONS',
			project_additions,			
		}
	},

	pullProjectAdditions(requestedProjectAdditions, receivedProjectAdditions) {

	  return function (dispatch) {

	    dispatch(requestedProjectAdditions());

	    return fetch(`/pullProjectAdditions`, {
	    	method: 'POST',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json',
	      },
    	})
      .then(response => response.json() )
      .then(project_additions => dispatch(receivedProjectAdditions(project_additions)) )
      .catch(error => console.error(error) );

	  }
	},

	requestedDiscussionPosts() {
		return {
			type: 'REQUESTED_DISCUSSION_POSTS',
		}
	},

	receivedDiscussionPosts(discussion_posts) {
		return {
			type: 'RECEIVED_DISCUSSION_POSTS',
			discussion_posts,			
		}
	},

	pullDiscussionPosts(requestedDiscussionPosts, receivedDiscussionPosts) {

	  return function (dispatch) {

	    dispatch(requestedDiscussionPosts());

	    return fetch(`/pullDiscussionPosts`, {
	    	method: 'POST',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json',
	      },
    	})
      .then(response => response.json() )
      .then(discussion_posts => dispatch(receivedDiscussionPosts(discussion_posts)) )
      .catch(error => console.error(error) );

	  }
	}
}

export default actions