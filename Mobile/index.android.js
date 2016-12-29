import React, { Component } from 'react';
import Main from './src/components/main.js';

import {
  AppRegistry,
} from 'react-native';

export default class StanfordFeedbackApp extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Main />
    );
  }
}

AppRegistry.registerComponent('StanfordFeedbackApp', () => StanfordFeedbackApp);
