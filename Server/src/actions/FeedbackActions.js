// Import libraries
import axios from 'axios';

// Import action types
import {
  FEEDBACK_CHANGED,
  UPDATE_NAV_STATE,
  ADD_PROJECT_UPVOTE,
  REMOVE_PROJECT_UPVOTE,
  LOAD_PROJECT_UPVOTES,
  SAVE_PROJECT_CHANGES,
  DELETE_PROJECT,
  REQUESTED_PROJECTS,
  RECEIVED_PROJECTS,
  SUBMIT_FEEDBACK,
  SUBMIT_FEEDBACK_SUCCESS,
  SUBMIT_FEEDBACK_FAIL,
  ADD_TO_DO_NOT_DISPLAY_LIST,
  LOAD_DO_NOT_DISPLAY_LIST,
  AUTHORIZE_USER_SUCCESS,
  AUTHORIZE_USER_FAIL,
} from './types';

// Handle Upvoting
export const addProjectUpvote = project => (
  (dispatch, getState) => {
    dispatch({ type: ADD_PROJECT_UPVOTE, payload: project });
    const { projectUpvotes } = getState().user;
    localStorage.setItem('projectUpvotes', JSON.stringify(projectUpvotes));
    dispatch(saveProjectChanges(project, 'add project upvote'));
  }
);

export const removeProjectUpvote = project => (
  (dispatch, getState) => {
    dispatch({ type: REMOVE_PROJECT_UPVOTE, payload: project });
    const { projectUpvotes } = getState().user;
    localStorage.setItem('projectUpvotes', JSON.stringify(projectUpvotes));
    dispatch(saveProjectChanges(project, 'remove project upvote'));
  }
);

export const loadProjectUpvotes = projectUpvotes => (
  {
    type: LOAD_PROJECT_UPVOTES,
    payload: projectUpvotes,
  }
);

// Handle project, project_addition changes
export const saveProjectChanges = (project, changeType) => (
  (dispatch, getState) => {
    dispatch({ type: SAVE_PROJECT_CHANGES, payload: project });

    // Save the project change to the server
    fetch(`/saveProjectChanges`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'        
      },
      body: JSON.stringify({ project, authorization: getState().auth.token })
    });

    addSubscriber(project.id, changeType);    
  }
);

export const saveProjectAdditionChanges = (project_addition, changeType) => (
  (dispatch, getState) => { 
    fetch(`/saveProjectAdditionChanges`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_addition,
        authorization: getState().auth.token
      })
    })
    .catch(error => console.error(error)); 

    addSubscriber(project_addition.project_id, changeType);   

    return {
      type: 'SAVE_PROJECT_ADDITION_CHANGES',
      project_addition
    }
  }
);


//Add Project, Solution, Subscriber
export const receivedIDForAddProject = (id, feedback) => (
  {
    type: 'ADD_PROJECT',
    id,
    feedback
  }
);

export const addProject = (feedback, type) => (   
  (dispatch, getState) => {

    return fetch(`/addProject`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feedback,
        authorization: getState().auth.token
      })
    })
    .then(response => response.json())
    .then(response => {
      console.log("receieved add project response", response);
      dispatch(receivedIDForAddProject(response.id, feedback));
      addSubscriber(response.id, type);     
    })
    .catch(error => console.error(error));
  }
);

export const receivedIDForAddSolution = (project_addition_id, project_id) => (
  {
    type: 'ADD_SOLUTION',
    project_addition_id,
    project_id,
  }
);

export const addSolution = (project_id, type) => (
  (dispatch, getState) => {   
    return fetch(`/addSolution`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_id,
        authorization: getState().auth.token
      })
    })
    .then(response => response.json())
    .then(response => {
      dispatch(receivedIDForAddSolution(response.id, project_id));
      addSubscriber(project_id, type);
    })    
    .catch(error => console.error(error));
  }
);

export const addSubscriber = (project_id, type) => (
  (dispatch, getState) => {   
    axios.post(`/addSubscriber`, { authorization: getState().auth.token, project_id, type });
  }
);

//Delete Project, Project_Addition
export const deleteProject = (id, type) => (
  (dispatch, getState) => {

    fetch(`/deleteProject`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        authorization: getState().auth.token
      })
    })
    .catch(error => console.error(error));  

    addSubscriber(id, type);      
    dispatch({ type: 'DELETE_PROJECT', payload: id });        
  }
);

export const deleteProjectAddition = (id) => (
  (dispatch, getState) => {
    fetch(`/deleteProjectAddition`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        authorization: getState().auth.token
      })
    })
    .catch(error => console.error(error));

    dispatch({ type: 'DELETE_PROJECT_ADDITION', payload: id });    
  }
);


//Pull Feedback, Projects, Project Additions, Discussions
export const requestedFeedback = (start_date, end_date) => (
  {
    type: 'REQUESTED_FEEDBACK',
    start_date,
    end_date,     
  }
);

export const receivedFeedback = (feedback) => (
  {
    type: 'RECEIVED_FEEDBACK',
    feedback,     
  }
);

export const updateDates = (start_date, end_date, token) => (
  (dispatch, getState) => {
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
        authorization: token
      }),
    })
    .then(response => response.json() )
    .then(feedback => dispatch(receivedFeedback(feedback)) )
    .catch(error => console.error(error) );
  } 
);

export const requestedProjects = () => (
  {
    type: 'REQUESTED_PROJECTS',
  }
);

export const receivedProjects = (projects) => (
  {
    type: 'RECEIVED_PROJECTS',
    projects,
  }
);

export const pullProjects = (token) => (
  function (dispatch, getState) {
    dispatch(requestedProjects());

    return axios.post(`/pullProjects`, { authorization: token })
    .then(response => {
      dispatch({ type: AUTHORIZE_USER_SUCCESS, payload: token });
      dispatch(receivedProjects(response.data));
    })
    .catch(error => {
      console.log(error);
      dispatch({ type: AUTHORIZE_USER_FAIL, payload: error.message })
    });
  }
);

export const requestedProjectAdditions = () => (
  {
    type: 'REQUESTED_PROJECT_ADDITIONS',
  }
);

export const receivedProjectAdditions = (project_additions) => (
  {
    type: 'RECEIVED_PROJECT_ADDITIONS',
    project_additions,      
  }
);

export const pullProjectAdditions = (token) => (
  function (dispatch, getState) {
  dispatch(requestedProjectAdditions());

  return fetch(`/pullProjectAdditions`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      authorization: token
    }),
  })
  .then(response => response.json() )
  .then(project_additions => dispatch(receivedProjectAdditions(project_additions)) )
  .catch(error => console.error(error));
  }
);

export const requestedDiscussionPosts = () => (
  {
    type: 'REQUESTED_DISCUSSION_POSTS',
  }
);

export const receivedDiscussionPosts = (discussion_posts) => (
  {
    type: 'RECEIVED_DISCUSSION_POSTS',
    discussion_posts,     
  }
);

export const pullDiscussionPosts = () => (
  function (dispatch, getState) {

    dispatch(requestedDiscussionPosts());

    return fetch(`/pullDiscussionPosts`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authorization: getState().auth.token
      }),
    })
    .then(response => response.json() )
    .then(discussion_posts => dispatch(receivedDiscussionPosts(discussion_posts)) )
    .catch(error => console.error(error));
  }
);
