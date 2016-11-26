//Import Libraries
import { createStore  } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';

//Import Reducers
import Main_Reducer from './reducer_main.js';

//Function returns a querystring value associated with the provided key
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

//Sets our initial state (before data is pulled from the server)
const INITIAL_STATE = {
	main: {
		totalNumDays: 0, //initialized by Pull Data action on app.js mount
		totalTime: 0, 
		totalPublicTime: 0,
		websites: [], 
		publicWebsites: [],
		categories: [], 
		publicCategories: [],
		userid: getUrlParameter('userid'),	
		categoriesChanged: [],
		urlsExcluded: [],
		urlsRemoved: [],
		recentChange: false,	
		privateUrlIndex: 0,
		publicUrlIndex: 0,
		settingsUrlIndex: 0
	}
};

let store = createStore(Main_Reducer, INITIAL_STATE);

export const history = syncHistoryWithStore(browserHistory, store);

export default store;

