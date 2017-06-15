import React, { Component } from 'react';
import Expo from 'expo';

import Index from './src/containers/index';

export default class FeedbackApp extends Component {
  render() {
    return (
      <Index />
    );
  }
}

Expo.registerRootComponent(FeedbackApp);
