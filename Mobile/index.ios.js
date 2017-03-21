import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

import Index from './src/containers/index';

export default class FeedbackApp extends Component {
  render() {
    return (
      <Index />
    );
  }
}

AppRegistry.registerComponent('FeedbackApp', () => FeedbackApp);
