// Import libaries
import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';
import { Notifications } from 'expo';


// Import Store
import store from '../reducers/store';
import loadOnLaunch from '../reducers/load_on_launch';

// Import components, functions, and styles
import Container from './Container';

// Defines a high-level (container) component
class Index extends Component {
  componentDidMount() {
    loadOnLaunch();

    Notifications.addListener((notification) => {
      const { data: { text }, origin } = notification;

      if (origin === 'received' && text) {
        Alert.alert(
          'New Push Notification',
          text,
          [{ text: 'Ok.' }],
        );
      }
    });
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
