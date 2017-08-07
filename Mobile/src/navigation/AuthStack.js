// Import Libraries
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

// Import Scenes and styles
import Authorize from '../scenes/Authorize';
import GroupCode from '../scenes/GroupCode';
import SendAuthorizationEmail from '../scenes/SendAuthorizationEmail';
import CreateGroup from '../scenes/CreateGroup';
import styles from '../styles/common/navStyles';
import InviteGroupUsers from '../scenes/InviteGroupUsers';
import InviteGroup from './components/InviteGroup';

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
    }),
  },
  CreateGroup: {
    screen: CreateGroup,
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
  InviteGroupUsers: {
    screen: InviteGroupUsers,
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
      headerRight: <InviteGroup inviteText={'Send'} navigation={navigation} />,
      headerTintColor: 'white',
    }),
  },
});

export default AuthStack;
