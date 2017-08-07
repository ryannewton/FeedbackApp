// Import Libraries
import { combineReducers } from 'redux';

// Import reducers
import auth from './reducer_auth';
import group from './reducer_group';
import solutions from './reducer_solutions';
import feedback from './reducer_feedback';
import user from './reducer_user';
import translation from './reducer_translation';

export default combineReducers({
  auth,
  group,
  solutions,
  feedback,
  user,
  translation,
});
