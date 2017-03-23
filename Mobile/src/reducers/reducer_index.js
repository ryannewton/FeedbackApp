// Import Libraries
import { combineReducers } from 'redux';

// Import reducers
import main from './reducer_main';
import navigation from './reducer_navigation';
import projects from './reducer_projects';
import auth from './reducer_auth';
import user from './reducer_user';
import solutions from './reducer_solutions';

export default combineReducers({
  main,
  navigation,
  projects,
  solutions,
  auth,
  user,
});
