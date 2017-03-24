// Import action types
import {
  REQUESTED_FEEDBACK,
  RECEIVED_FEEDBACK,
  ADD_PROJECT,
  ADD_SOLUTION,
  ADD_PROJECT_UPVOTE,
  REMOVE_PROJECT_UPVOTE,
  LOAD_PROJECT_UPVOTES,
  SAVE_PROJECT_CHANGES,
  DELETE_PROJECT,
  DELETE_PROJECT_ADDITION,
  REQUESTED_PROJECTS,
  RECEIVED_PROJECTS,
  REQUESTED_PROJECT_ADDITIONS,
  RECEIVED_PROJECT_ADDITIONS,
  AUTHORIZE_USER_SUCCESS,
  AUTHORIZE_USER_FAIL,
} from './types';

// Import constants
import http from '../constants';

export const addSubscriber = (project_id, type) => (
  (dispatch, getState) => {
    http.post('/addSubscriber', { authorization: getState().auth.token, project_id, type });
  }
);

// Handle project, projectAddition changes
export const saveProjectChanges = (project, changeType) => (
  (dispatch, getState) => {
    dispatch({ type: SAVE_PROJECT_CHANGES, project });

    http.post('/saveProjectChanges', {
      project,
      authorization: getState().auth.token,
    })
    .catch(error => console.log(error));

    addSubscriber(project.id, changeType);
  }
);

export const saveProjectAdditionChanges = (project_addition, changeType) => (
  (dispatch, getState) => {
    http.post('/saveProjectAdditionChanges', {
      project_addition,
      authorization: getState().auth.token,
    })
    .catch(error => console.error(error));

    addSubscriber(project_addition.project_id, changeType);

    return {
      type: 'SAVE_PROJECT_ADDITION_CHANGES',
      project_addition,
    };
  }
);

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

// Handle Feedback
export const requestedFeedback = (startDate, endDate) => (
  {
    type: REQUESTED_FEEDBACK,
    startDate,
    endDate,
  }
);

export const receivedFeedback = feedback => (
  {
    type: RECEIVED_FEEDBACK,
    feedback,
  }
);

export const updateDates = (startDate, endDate, token) => (
  (dispatch, getState) => {
    dispatch(requestedFeedback(startDate, endDate));

    http.post('/pullFeedback', {
      startDate,
      endDate,
      authorization: token || getState().auth.token,
    })
    .then(response => dispatch(receivedFeedback(response.data)))
    .catch(error => console.log(error));
  }
);

// Add Project, Solution, Subscriber
export const receivedIDForAddProject = (id, feedback) => (
  {
    type: ADD_PROJECT,
    id,
    feedback,
  }
);

export const addProject = (feedback, type) => (
  (dispatch, getState) => {
    http.post('/addProject', {
      feedback,
      authorization: getState().auth.token,
    })
    .then((response) => {
      dispatch(receivedIDForAddProject(response.data.id, feedback));
      addSubscriber(response.data.id, type);
    })
    .catch(error => console.error(error));
  }
);

export const receivedIDForAddSolution = (project_addition_id, project_id) => (
  {
    type: ADD_SOLUTION,
    project_addition_id,
    project_id,
  }
);

export const addSolution = (project_id, type) => (
  (dispatch, getState) => {
    http.post('/addSolution', {
      project_id,
      authorization: getState().auth.token,
    })
    .then((response) => {
      dispatch(receivedIDForAddSolution(response.data.id, project_id));
      addSubscriber(project_id, type);
    })
    .catch(error => console.error(error));
  }
);

// Delete Project, Project_Addition
export const deleteProject = (id, type) => (
  (dispatch, getState) => {
    http.post('/deleteProject', {
      id,
      authorization: getState().auth.token,
    })
    .catch(error => console.error(error));

    addSubscriber(id, type);
    dispatch({ type: DELETE_PROJECT, payload: id });
  }
);

export const deleteProjectAddition = id => (
  (dispatch, getState) => {
    http.post('/deleteProjectAddition', {
      id,
      authorization: getState().auth.token,
    })
    .catch(error => console.error(error));

    dispatch({ type: DELETE_PROJECT_ADDITION, payload: id });
  }
);

export const requestedProjects = () => (
  {
    type: REQUESTED_PROJECTS,
  }
);

export const receivedProjects = projects => (
  {
    type: RECEIVED_PROJECTS,
    projects,
  }
);

export const pullProjects = token => (
  (dispatch) => {
    dispatch(requestedProjects());

    return http.post('/pullProjects', { authorization: token })
    .then((response) => {
      dispatch({ type: AUTHORIZE_USER_SUCCESS, payload: token });
      dispatch(receivedProjects(response.data));
    })
    .catch((error) => {
      console.log(error);
      dispatch({ type: AUTHORIZE_USER_FAIL, payload: error.message });
    });
  }
);

export const requestedProjectAdditions = () => (
  {
    type: REQUESTED_PROJECT_ADDITIONS,
  }
);

export const receivedProjectAdditions = projectAdditions => (
  {
    type: RECEIVED_PROJECT_ADDITIONS,
    projectAdditions,
  }
);

export const pullProjectAdditions = token => (
  (dispatch) => {
    dispatch(requestedProjectAdditions());

    http.post('/pullProjectAdditions', {
      authorization: token,
    })
    .then(response => dispatch(receivedProjectAdditions(response.data)))
    .catch(error => console.error(error));
  }
);
