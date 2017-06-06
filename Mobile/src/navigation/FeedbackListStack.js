// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

// Import Scenes
import FeedbackList from '../scenes/FeedbackList';
import FeedbackDetails from '../scenes/FeedbackDetails';
import styles from '../styles/common/navStyles';

// Stack of scenes
const scenes = StackNavigator({
  FeedbackList: {
    screen: FeedbackList,
    navigationOptions: {
      title: 'All Feedback',
      headerStyle: { height: styles.header.height },
    },
  },
  Details: {
    screen: FeedbackDetails,
    navigationOptions: {
      title: 'Feedback Details',
      headerStyle: { height: styles.header.height },
    },
  },
});

// Stack options
const options = {
  tabBarLabel: 'All Feedback',
  tabBarIcon: ({ tintColor }) => <Icon name="view-list" size={22} color={tintColor} />,
  cardStack: { gesturesEnabled: false },
};

const FeedbackListStack = {
  screen: scenes,
  navigationOptions: options,
};

export default FeedbackListStack;
