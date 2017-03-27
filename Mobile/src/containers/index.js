// Import libaries
import React, { Component } from 'react';
import { Provider } from 'react-redux';

// Import Store
import store from '../reducers/store';

// Import components, functions, and styles
import { Root } from './router';

// Defines a high-level (container) component
class Index extends Component {
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}

export default Index;
