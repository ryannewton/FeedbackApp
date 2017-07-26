// Import Libraries
import { combineReducers } from 'redux';

// Import Reducers
import auth from './reducer_auth';
import feedback from './reducer_feedback';
import solutions from './reducer_solutions';
import group from './reducer_group';
import categories from './reducer_categories';

const reducers = {
  auth,
  feedback,
  solutions,
  group,
  categories,
};

export default combineReducers({
  ...reducers,
});
