// Import Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

// Import Views
import Container from './components/Container';
import Feedback from './components/Feedback';
import Projects from './components/Projects';

// Import Store
import store, { history } from './reducers/store';

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={Container}>
        <IndexRoute component={Projects} />
        <Route path='/projects/:stage' component={Projects} />
        <Route path='/feedback' component={Feedback} />
      </Route>
    </Router>
  </Provider>,
  document.querySelector('.app'));
