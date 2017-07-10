// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import SearchBar from '../components/SearchBar';

// Import Scenes
import UnreadFeedbackList from '../scenes/UnreadFeedbackList';
import FeedbackDetails from '../scenes/FeedbackDetails';
import styles from '../styles/common/navStyles';

// Stack of scenes
const scenes = StackNavigator({
  UnreadFeedbackList: {
    screen: UnreadFeedbackList,
    navigationOptions: {
      title: 'Unread Feedback',
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
    },
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
