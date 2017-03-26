// Import Libraries
import { createStore, applyMiddleware } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import thunkMiddleware from 'redux-thunk';

// Import actions
import * as actions from '../actions';

// Import Reducers
import Combined_Reducer from './reducer_index.js';

let store = createStore(
	Combined_Reducer,
	applyMiddleware(thunkMiddleware)
);

let token = localStorage.getItem('token') || null;
store.dispatch(actions.loadData(token));

export const history = syncHistoryWithStore(browserHistory, store);

export default store;

