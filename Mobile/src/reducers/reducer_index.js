// Import Libraries
import { combineReducers } from 'redux';

// Import reducers
import main from './reducer_main';
import projects from './reducer_projects';
import auth from './reducer_auth';
import user from './reducer_user';
import solutions from './reducer_solutions';

export default combineReducers({
  main,
  projects,
  solutions,
  auth,
  user,
});
