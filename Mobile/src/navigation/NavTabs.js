// Import Libraries
import React from 'react';
import { TabNavigator } from 'react-navigation';

// Import Stacks
import FeedbackSubmitStack from './FeedbackSubmitStack';
import FeedbackSwipeStack from './FeedbackSwipeStack';
import FeedbackListStack from './FeedbackListStack';

// Stacks for each tab
const stacks = {
  FeedbackSubmit: FeedbackSubmitStack,
  FeedbackSwipe: FeedbackSwipeStack,
  FeedbackList: FeedbackListStack,
};

// Tab options
const options = {
  swipeEnabled: false,
  backBehavior: 'none',
  lazy: true,
  tabBarOptions: {
    showIcon: true,
    style: { backgroundColor: 'white' },
    indicatorStyle: { backgroundColor: '#A41034' },
    tabStyle: { margin: 0, padding: 8, height: 55 },
    labelStyle: { margin: 0, padding: 0, fontSize: 11 },
    activeTintColor: '#A41034',
    inactiveTintColor: 'grey',
  },
};

const NavTabs = TabNavigator(
  stacks,
  options,
);

export default NavTabs;
