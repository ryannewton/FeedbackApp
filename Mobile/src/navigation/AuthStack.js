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
      headerStyle: {
        height: styles.header.height,
        marginTop: styles.header.marginTop,
      },
    },
  },
  AuthCode: {
    screen: Authorize,
    navigationOptions: {
      title: 'Enter Code From Email',
      headerStyle: {
        height: styles.header.height,
        marginTop: styles.header.marginTop,
      },
    },
  },
});

export default AuthStack;
