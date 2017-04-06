// Import libraries
import { AsyncStorage } from 'react-native';

// Import action types
import {
  FEEDBACK_CHANGED,
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

// Import constants
import { http, ROOT_URL, ROOT_STORAGE } from '../constants';

// Handle Upvoting
export const addProjectUpvote = project => (
  (dispatch, getState) => {
    dispatch({ type: ADD_PROJECT_UPVOTE, payload: project });
    const { projectUpvotes } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}projectUpvotes`, JSON.stringify(projectUpvotes));
    AsyncStorage.setItem(`${ROOT_STORAGE}upvotes`, JSON.stringify(projectUpvotes));
    dispatch(saveProjectChanges(project, 'add project upvote'));
  }
);

export const removeProjectUpvote = project => (
  (dispatch, getState) => {
    dispatch({ type: REMOVE_PROJECT_UPVOTE, payload: project });
    const { projectUpvotes } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}projectUpvotes`, JSON.stringify(projectUpvotes));
    AsyncStorage.setItem(`${ROOT_STORAGE}upvotes`, JSON.stringify(projectUpvotes));
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
export const feedbackChanged = feedback => (
  {
    type: FEEDBACK_CHANGED,
    payload: feedback,
  }
);

export const submitFeedbackToServer = route => (
  (dispatch, getState) => {
    dispatch({ type: SUBMIT_FEEDBACK });

    const { feedback } = getState().main;

    // Post new feedback to server
    return http.post('/addFeedback/', { text: feedback, authorization: getState().auth.token })
    .then(() => {
      dispatch({ type: SUBMIT_FEEDBACK_SUCCESS });
    })
    .catch((error) => {
      console.error('Error in submitFeedbackToServer in FeedbackActions', error.message);
      dispatch({ type: SUBMIT_FEEDBACK_FAIL });
    });
  }
);

// Handle New Projects
export const addToDoNotDisplayList = projectID => (
  (dispatch, getState) => {
    dispatch({ type: ADD_TO_DO_NOT_DISPLAY_LIST, payload: projectID });
    const { doNotDisplayList } = getState().user;
    AsyncStorage.setItem(`${ROOT_STORAGE}doNotDisplayList`, JSON.stringify(doNotDisplayList));
  }
);

export const loadDoNotDisplayList = list => (
  {
    type: LOAD_DO_NOT_DISPLAY_LIST,
    payload: list,
  }
);

// Handle Projects
export const saveProjectChanges = (project, changeType) => (
  (dispatch, getState) => {
    dispatch({ type: SAVE_PROJECT_CHANGES, payload: project });

    const { token } = getState().auth;

    // Save the project change to the server
    fetch(`${ROOT_URL}/saveProjectChanges`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: token,
      },
      body: JSON.stringify({ project, authorization: token }),
    });

    // Subscribe the user to the project
    http.post('/addSubscriber', { authorization: token, projectId: project.id, type: changeType });
  }
);

export const deleteProject = id => ({
  type: DELETE_PROJECT,
  payload: id,
});

export const requestedProjects = () => ({
  type: REQUESTED_PROJECTS,
});

export const receivedProjects = projects => ({
  type: RECEIVED_PROJECTS,
  payload: projects,
});

// To Do: Convert `${ROOT_URL}/pullProjects` to GET on server
export const pullProjects = token => (
  function (dispatch) {
    dispatch(requestedProjects());

    return http.post('/pullProjects', { authorization: token })
    .then((response) => {
      dispatch({ type: AUTHORIZE_USER_SUCCESS, payload: token });
      dispatch(receivedProjects(response.data));
    })
    .catch((error) => {
      console.log('pull projects error', error.message);
      dispatch({ type: AUTHORIZE_USER_FAIL, payload: '' });
    });
  }
);
