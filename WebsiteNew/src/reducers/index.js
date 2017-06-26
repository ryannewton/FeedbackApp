import { combineReducers } from 'redux';
import authReducer from './auth_reducer';
import feedbackReducer from './feedback_reducer';
import solutionsReducer from './solutions_reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  feedback: feedbackReducer,
  solutions: solutionsReducer,
});

export default rootReducer;
