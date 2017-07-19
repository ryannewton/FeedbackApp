import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from './reducer_auth';
import feedback from './reducer_feedback';
import solutions from './reducer_solutions';
import sideMenu from './sideMenu';
import views from './views';
import group from './reducer_group';

const reducers = {
  auth,
  feedback,
  solutions,
  sideMenu,
  views,
  group,
};

export default combineReducers({
  ...reducers,
  routing: routerReducer
});
