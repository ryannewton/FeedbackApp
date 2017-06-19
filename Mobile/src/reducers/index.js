// Import Libraries
import { combineReducers } from 'redux';

// Import reducers
import auth from './reducer_auth';
import group from './reducer_group';
import solutions from './reducer_solutions';
import feedback from './reducer_feedback';
import user from './reducer_user';

export default combineReducers({
  auth,
  group,
  solutions,
  feedback,
  user,
});
