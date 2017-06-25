// Import Libraries
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// Import reducers
import main from './reducer_main';
import projects from './reducer_projects';
import auth from './reducer_auth';
import user from './reducer_user';
import feedback from './reducer_feedback';
import projectAdditions from './reducer_projectAdditions';

export default combineReducers({
  main,
  projects,
  auth,
  user,
  feedback,
  projectAdditions,
  routing: routerReducer,
});
