import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from './auth_reducer';
import feedback from './feedback_reducer';
import solutions from './solutions_reducer';
import sideMenu from './sideMenu';
import views from './views';

const reducers = {
  auth,
  feedback,
  solutions,
  sideMenu,
  views,
};

export default combineReducers({
  ...reducers,
  routing: routerReducer
});
