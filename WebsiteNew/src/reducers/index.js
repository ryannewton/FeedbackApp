import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import authReducer from './auth_reducer';
import feedbackReducer from './feedback_reducer';
import solutionsReducer from './solutions_reducer';

const rootReducer = combineReducers({
  form,
  auth: authReducer,
  feedback: feedbackReducer,
  solutions: solutionsReducer,
});

export default rootReducer;
