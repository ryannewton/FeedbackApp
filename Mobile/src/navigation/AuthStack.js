// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';

// Import Scenes and styles
import Authorize from '../scenes/Authorize';
import SendAuthorizationEmail from '../scenes/SendAuthorizationEmail';
import styles from '../styles/common/navStyles';

const AuthStack = StackNavigator({
  SubmitEmail: {
    screen: SendAuthorizationEmail,
    navigationOptions: {
      title: 'Verify Your Organization',
      headerTitleStyle: {
        color: '#fff'
      },
      headerStyle: {
        height: styles.header.height,
        marginTop: styles.header.marginTop,
        backgroundColor: '#00A2FF',
      },
    },
  },
  AuthCode: {
    screen: Authorize,
    navigationOptions: {
      title: 'Enter Code From Email',
      headerTitleStyle: {
        color: '#fff'
      },
      headerStyle: {
        height: styles.header.height,
        marginTop: styles.header.marginTop,
        backgroundColor: '#00A2FF',
      },
    },
  },
});

export default AuthStack;
