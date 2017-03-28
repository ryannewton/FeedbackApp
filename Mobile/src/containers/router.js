// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';

// Import Tabs, Stacks, and Scenes
import NavTabs from './NavTabs';
import Authorize from '../scenes/Authorize';
import SendAuthorizationEmail from '../scenes/SendAuthorizationEmail';


export const AuthStack = StackNavigator({
  SubmitEmail: {
    screen: SendAuthorizationEmail,
    navigationOptions: {
      title: 'Verify Your University',
      header: {
        style: { height: 45 },
      },
    },
  },
  AuthCode: {
    screen: Authorize,
    navigationOptions: {
      title: 'Enter Code From Email',
      header: {
        style: { height: 45 },
      },
    },
  },
});

export const Root = StackNavigator({
  Tabs: {
    screen: NavTabs,
  },
  Auth: {
    screen: AuthStack,
  },
}, {
  mode: 'modal',
  headerMode: 'none',
});
