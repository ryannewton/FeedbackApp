// @flow weak

// Import Libraries
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { createBrowserHistory } from 'history';

// Import Redux and main App
import configureStore from './redux/store/configureStore';
import App from './containers/App';

const store = configureStore({});
const history = createBrowserHistory();
const syncedHistory = syncHistoryWithStore(history, store);

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <Router history={syncedHistory}>
            <App />
          </Router>
        </div>
      </Provider>
    );
  }
}

export default Root;
