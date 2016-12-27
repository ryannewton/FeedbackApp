//Import Libraries
import { createStore, applyMiddleware } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import thunkMiddleware from 'redux-thunk';
import Actions from '../actions/actions.js';

//Import Reducers
import Combined_Reducer from './reducer_index.js';

//Sets our initial state (before data is pulled from the server)
const INITIAL_STATE = {
	main: {
		start_date: null,
    end_date: null	
	},
	feedback: [],
	projects: []
};

let store = createStore(
	Combined_Reducer,
	INITIAL_STATE,
	applyMiddleware(thunkMiddleware)
);

let time = new Date(Date.now());
let timeISO = time.toISOString();
let timeSliced = timeISO.slice(0, 10);

store.dispatch(Actions.updateDates('2016-11-01', timeSliced, Actions.requestedFeedback, Actions.receivedFeedback));
store.dispatch(Actions.pullProjects(Actions.requestedProjects, Actions.receivedProjects));

export const history = syncHistoryWithStore(browserHistory, store);

export default store;

