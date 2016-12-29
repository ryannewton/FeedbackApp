//Import Libraries
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';

//Import Views
import Container from './components/container.js';
import Feedback from './components/feedback.js';
import Rank from './components/rank.js';
import Settings from './components/settings.js';

//Import Store
import store, { history } from './reducers/store.js';

ReactDOM.render(
	<Provider store={store}>
		<Router history={hashHistory}>
      <Route path='/' component={Container}>
        <IndexRoute component={Rank} />
        <Route path='/feedback' component={Feedback} />
        <Route path='/settings' component={Settings} />
      </Route>
 		</Router>		
	</Provider>
	, document.querySelector('.app'));
