//Import Libraries
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';

//Import Views
import Container from './components/container.js';
import UrlCategoryView from './components/urlcategoryview.js';
import Settings from './components/settings.js';
import Admin from './components/admin.js';

//Import Store
import store, { history } from './reducers/store.js';

ReactDOM.render(
	<Provider store={store}>
		<Router history={hashHistory}>
        <Route path='/' component={Container}>
          <IndexRoute component={UrlCategoryView} />
          <Route path='/category' component={UrlCategoryView} />
          <Route path='/settings' component={Settings} />
          <Route path='/admin' component={Admin} />
          <Route path='*' component={UrlCategoryView} />
        </Route>
   		</Router>		
	</Provider>
	, document.querySelector('.app'));
