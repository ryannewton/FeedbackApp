import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import sideMenu from './sideMenu';
import views from './views';

export const reducers = {
  sideMenu,
  views
};

export default combineReducers({
  ...reducers,
  routing: routerReducer
});
