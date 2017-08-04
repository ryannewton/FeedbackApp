// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';

// Import Scenes and styles
import Authorize from '../scenes/Authorize';
import GroupCode from '../scenes/GroupCode';
import SendAuthorizationEmail from '../scenes/SendAuthorizationEmail';
import styles from '../styles/common/navStyles';
import translate from '../translation';

const AuthStack = StackNavigator({
  SubmitEmail: {
    screen: SendAuthorizationEmail,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params,
      headerTitleStyle: {
        color: '#fff',
      },
      headerStyle: {
        height: styles.header.height,
        marginTop: styles.header.marginTop,
        backgroundColor: '#00A2FF',
      },
      headerTintColor: 'white',
    }),
  },
  AuthCode: {
    screen: Authorize,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params,
      headerTitleStyle: {
        color: '#fff',
      },
      headerStyle: {
        height: styles.header.height,
        marginTop: styles.header.marginTop,
        backgroundColor: '#00A2FF',
      },
      headerTintColor: 'white',
    }),
  },
  AuthGroupCode: {
    screen: GroupCode,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params,
      headerTitleStyle: {
        color: '#fff',
      },
      headerStyle: {
        height: styles.header.height,
        marginTop: styles.header.marginTop,
        backgroundColor: '#00A2FF',
      },
      headerTintColor: 'white',
    })
  },
});

export default AuthStack;
