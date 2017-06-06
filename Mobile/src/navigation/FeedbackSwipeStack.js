// Import Libraries
import React from 'react';
import { Image } from 'react-native';
import { StackNavigator } from 'react-navigation';

// Import Scenes
import FeedbackSwipe from '../scenes/FeedbackSwipe';
import FeedbackDetails from '../scenes/FeedbackDetails';
import styles from '../styles/common/navStyles';

// Import icons
import FeedbackSwipeSelected from '../../images/icons/newprojects2-selected_100px.png';
import FeedbackSwipeNotSelected from '../../images/icons/newprojects2-notselected_100px.png';

// Stack of scenes
const scenes = StackNavigator(
  {
    FeedbackSwipe: {
      screen: FeedbackSwipe,
      navigationOptions: {
        title: 'New Feedback',
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
  },
);

// Stack options
const options = {
  tabBarLabel: 'New Feedback',
  tabBarIcon: ({ tintColor }) => {
    if (tintColor === 'grey') {
      return <Image source={FeedbackSwipeNotSelected} style={{ width: 22, height: 22 }} />;
    }
    return <Image source={FeedbackSwipeSelected} style={{ width: 22, height: 22 }} />;
  },
  cardStack: {
    gesturesEnabled: false,
  },
};

const FeedbackSwipeStack = {
  screen: scenes,
  navigationOptions: options,
};

export default FeedbackSwipeStack;
