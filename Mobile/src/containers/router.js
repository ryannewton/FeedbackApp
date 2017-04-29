// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';

// Import Tabs, Stacks, and Scenes
import NavTabs from './NavTabs';
import Authorize from '../scenes/Authorize';
import SendAuthorizationEmail from '../scenes/SendAuthorizationEmail';
import SplashScreen from '../scenes/SplashScreen';
import styles from '../styles/common/navStyles';

export const SplashScreenStack = StackNavigator(
  {
    SplashScreen: {
      screen: SplashScreen,
      navigationOptions: {
        header: {
          visible: false,
        },
      },
    },
  },
);

export const AuthStack = StackNavigator({
  SubmitEmail: {
    screen: SendAuthorizationEmail,
    navigationOptions: {
      title: 'Verify Your Organization',
      header: {
        style: { height: styles.header.height },
      },
    },
  },
  AuthCode: {
    screen: Authorize,
    navigationOptions: {
      title: 'Enter Code From Email',
      header: {
        style: { height: styles.header.height },
      },
    },
  },
});

export const Root = StackNavigator({
  SplashScreen: {
    screen: SplashScreenStack,
  },
  Auth: {
    screen: AuthStack,
  },
  Tabs: {
    screen: NavTabs,
  },
}, {
  mode: 'modal',
  headerMode: 'none',
});
