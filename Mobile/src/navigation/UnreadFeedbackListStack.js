// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { View } from 'react-native';

// Import Scenes & Components
import UnreadFeedbackList from '../scenes/UnreadFeedbackList';
import FeedbackDetails from '../scenes/FeedbackDetails';
import SendInviteTextButton from './components/SendInviteTextButton';
import styles from '../styles/common/navStyles';

// Stack of scenes
const scenes = StackNavigator({
  UnreadFeedbackList: {
    screen: UnreadFeedbackList,
    navigationOptions: ({ navigation }) => ({
      title: 'Unread Feedback',
      headerRight: <View style = {{paddingRight: 15}}><SendInviteTextButton navigation={navigation} /></View>,
      headerTitleStyle: {
        color: '#fff',
        fontWeight: 'bold',
      },
      headerStyle: {
        height: styles.header.height,
        marginTop: styles.header.marginTop,
        backgroundColor: '#00A2FF',
      },
      headerTintColor: 'white',
    }),
  },
  Details: {
    screen: FeedbackDetails,
    navigationOptions: {
      title: 'Proposed Solutions',
      headerTitleStyle: {
        color: '#fff',
      },
      headerStyle: {
        height: styles.header.height,
        marginTop: styles.header.marginTop,
        backgroundColor: '#00A2FF',
      },
      headerTintColor: 'white',
    },
  },
});

// Stack options
const options = {
  tabBarLabel: 'Unread Feedback',
  tabBarIcon: ({ tintColor }) => <Icon name="email" size={22} color={tintColor} />,
  cardStack: { gesturesEnabled: false },
};

const FeedbackListStack = {
  screen: scenes,
  navigationOptions: options,
};

export default FeedbackListStack;
