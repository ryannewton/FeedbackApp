import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import earningGraph from './earningGraph';
import sideMenu from './sideMenu';
import userInfos from './userInfos';
import teamMates from './teamMates';
import views from './views';
import authReducer from './auth_reducer';
import feedbackReducer from './feedback_reducer';
import solutionsReducer from './solutions_reducer';

export const reducers = {
  earningGraph,
  sideMenu,
  userInfos,
  teamMates,
  views,
  auth: authReducer,
  feedback: feedbackReducer,
  solutions: solutionsReducer,
};

export default combineReducers({
  ...reducers,
  routing: routerReducer
});
