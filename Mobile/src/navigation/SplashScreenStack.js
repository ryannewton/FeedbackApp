// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';

// Import Scenes
import SplashScreen from '../scenes/SplashScreen';


const SplashScreenStack = StackNavigator(
  {
    SplashScreen: {
      screen: SplashScreen,
      navigationOptions: {
        header: null,
        headerTintColor: 'white',
      },
    },
  },
);

export default SplashScreenStack;
