//Import Libraries
import { createStore, applyMiddleware } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import thunkMiddleware from 'redux-thunk';

//Import Actions
import Actions from '../actions/actions.js';

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
store.dispatch(Actions.updateDates('2016-11-01', time, Actions.requestedFeedback, Actions.receivedFeedback));

store.dispatch(Actions.pullProjects(Actions.requestedProjects, Actions.receivedProjects, Actions.pullProjectAdditions, Actions.requestedProjectAdditions, Actions.receivedProjectAdditions, Actions.pullDiscussionPosts, Actions.requestedDiscussionPosts, Actions.receivedDiscussionPosts));

store.dispatch(Actions.setUpVotes(JSON.parse(localStorage.getItem('upVotes')) || [0]));

store.dispatch(Actions.updateEmail(localStorage.getItem('email')));

export const history = syncHistoryWithStore(browserHistory, store);

export default store;

