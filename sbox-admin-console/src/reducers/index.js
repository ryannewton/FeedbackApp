// Import Libraries
import { combineReducers } from 'redux';

// Import Reducers
import auth from './reducer_auth';
import feedback from './reducer_feedback';
import solutions from './reducer_solutions';
import group from './reducer_group';

const reducers = {
  auth,
  feedback,
  solutions,
  group,
};

export default combineReducers({
  ...reducers,
});
