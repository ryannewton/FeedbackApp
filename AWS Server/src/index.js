//Import Libraries
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';

//Import Views
import Container from './components/container.js';
import Feedback from './components/feedback.js';

//Import Store
import store, { history } from './reducers/store.js';

ReactDOM.render(
	<Provider store={store}>
		<Router history={hashHistory}>
        <Route path='/' component={Container}>
          <IndexRoute component={Feedback} />
        </Route>
   		</Router>		
	</Provider>
	, document.querySelector('.app'));
