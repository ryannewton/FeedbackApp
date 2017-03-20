//Import Libraries
import { createStore, applyMiddleware } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import thunkMiddleware from 'redux-thunk';

//Import actions
import * as actions from '../actions';

//Import Reducers
import Combined_Reducer from './reducer_index.js';

//Sets our initial state (before data is pulled from the server)
const INITIAL_STATE = {
	main: {
		email: null,
		start_date: null,
    	end_date: null,    
	},
	feedback: [],
	projects: [],	
	project_additions: [],
	discussion_posts: [],
	up_votes: [],
};

let store = createStore(
	Combined_Reducer,
	INITIAL_STATE,
	applyMiddleware(thunkMiddleware)
);

let time = new Date(Date.now()).toISOString().slice(0, 10);
let token = localStorage.getItem('token') || null;
store.dispatch(actions.updateDates('2016-11-01', time, token));
store.dispatch(actions.pullProjects(token));
store.dispatch(actions.pullProjectAdditions(token));
store.dispatch(actions.setUpVotes(JSON.parse(localStorage.getItem('upVotes')) || [0]));

export const history = syncHistoryWithStore(browserHistory, store);

export default store;

