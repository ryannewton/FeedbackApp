// Import libaries
import React, { Component } from 'react';
import { Provider } from 'react-redux';

// Import Store
import store from '../reducers/store';
import loadOnLaunch from '../reducers/load_on_launch';

// Import components, functions, and styles
import Container from './Container';

// Defines a high-level (container) component
class Index extends Component {
  componentDidMount() {
     loadOnLaunch();
  }

  render() {
    return (
      <Provider store={store}>
        <Container />
      </Provider>
    );
  }
}

export default Index;
