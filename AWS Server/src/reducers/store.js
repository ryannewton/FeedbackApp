//Import Libraries
import { createStore  } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';

//Import Reducers
import Main_Reducer from './reducer_main.js';

//Sets our initial state (before data is pulled from the server)
const INITIAL_STATE = {
	main: {
		start_date: "2016-01-01",
		end_date: "2018-01-01",		
		feedback: [],
	}
};

let store = createStore(Main_Reducer, INITIAL_STATE);

export const history = syncHistoryWithStore(browserHistory, store);

export default store;

