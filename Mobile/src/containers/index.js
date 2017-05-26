// Import libaries
import React, { Component } from 'react';
import { Provider } from 'react-redux';

// Import Store
import store from '../reducers/store';
import loadOnLaunch from '../reducers/loadOnLaunch';

// Import components, functions, and styles
import Router from './router';

// Defines a high-level (container) component
class Index extends Component {
  componentDidMount() {
    loadOnLaunch();
  }

  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}

export default Index;
