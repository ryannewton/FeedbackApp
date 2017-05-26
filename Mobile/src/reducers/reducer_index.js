// Import Libraries
import { combineReducers } from 'redux';

// Import reducers
import feedback from './reducer_feedback';
import projects from './reducer_projects';
import auth from './reducer_auth';
import user from './reducer_user';
import solutions from './reducer_solutions';
import features from './reducer_features';

export default combineReducers({
  feedback,
  projects,
  solutions,
  auth,
  user,
  features,
});
