// Import action types
import {
  ADD_PROJECT,
  SAVE_PROJECT_CHANGES,
  DELETE_PROJECT,
  REQUESTED_PROJECTS,
  RECEIVED_PROJECTS,
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

export const saveProjectChanges = (project, changeType) => (
  (dispatch, getState) => {
    dispatch({ type: SAVE_PROJECT_CHANGES, project });

    http.post('/saveProjectChanges', {
      project,
      authorization: getState().auth.token,
    })
    .catch(error => console.log(error));

    dispatch(addSubscriber(project.id, changeType));
  }
);

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
      dispatch(addSubscriber(response.data.id, type));
    })
    .catch(error => console.error(error));
  }
);

export const deleteProject = (id, type) => (
  (dispatch, getState) => {
    http.post('/deleteProject', {
      id,
      authorization: getState().auth.token,
    })
    .catch(error => console.error(error));

    dispatch(addSubscriber(id, type));
    dispatch({ type: DELETE_PROJECT, payload: id });
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
