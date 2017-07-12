import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Route, Router, IndexRoute, browserHistory } from 'react-router';
import reduxThunk from 'redux-thunk';

// Import pages
import App from './containers/app';
import Landing from './pages/Landing';
import SendCode from './pages/SendCode';
import AuthorizeUser from './pages/AuthorizeUser';
import Signout from './pages/Signout';
import ApproveFeedback from './pages/ApproveFeedback';
import ApproveSolutions from './pages/ApproveSolutions';
import ManageFeedback from './pages/ManageFeedback';
import reducers from './reducers';

// Import Actions
import { pullFeedback, pullSolutions } from './actions';
import { AUTHORIZE_USER_SUCCESS } from './actions/types';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

const token = localStorage.getItem('token');

if (token) {
  // If they have a token, set client state to authenticated before page loads
  // Note: If a malicious user sets a fake token, the client will allow
  //  them to navigate to protected routes, but the server will not send protected data
  store.dispatch({ type: AUTHORIZE_USER_SUCCESS });
  store.dispatch(pullFeedback);
  store.dispatch(pullSolutions);
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/admin.html' component={App}>
        <IndexRoute component = {Landing} />
        <Route path='/sendcode' component={SendCode} />
        <Route path='/authorize' component={AuthorizeUser} />
        <Route path='/signout' component={Signout} />
        <Route path='/approvefeedback' component={ApproveFeedback} />
        <Route path='/approvesolutions' component={ApproveSolutions} />
        <Route path='/managefeedback' component={ManageFeedback} />
      </Route>
    </Router>
  </Provider>
  , document.querySelector('.container')
);
