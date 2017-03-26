// Import types & other action creators
import {
  ADD_SOLUTION,
  DELETE_PROJECT_ADDITION,
  REQUESTED_PROJECT_ADDITIONS,
  RECEIVED_PROJECT_ADDITIONS,
} from './types';

import { addSubscriber } from './actions_projects';

// Import constants
import http from '../constants';

export const saveProjectAdditionChanges = (project_addition, changeType) => (
  (dispatch, getState) => {
    http.post('/saveProjectAdditionChanges', {
      project_addition,
      authorization: getState().auth.token,
    })
    .catch(error => console.error(error));

    dispatch(addSubscriber(project_addition.project_id, changeType));

    return {
      type: 'SAVE_PROJECT_ADDITION_CHANGES',
      project_addition,
    };
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
      dispatch(addSubscriber(project_id, type));
    })
    .catch(error => console.error(error));
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
