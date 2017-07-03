import React from 'react';
import Index from './src/containers/index';
import { Font } from 'expo';
import { Text } from 'react-native';

export default class App extends React.Component {
  state = {
    fontLoaded: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      'Arial': require('./assets/fonts/arial.ttf'),
    });

    this.setState({ fontLoaded: true });
  }

  render() {
    return (
      this.state.fontLoaded ? (
        <Index />
      ) : null
    );
  }
}
