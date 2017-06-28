// Import Libraries
import React from 'react';
import { TabNavigator } from 'react-navigation';

// Import Stacks
import FeedbackSubmitStack from './FeedbackSubmitStack';
//import FeedbackSwipeStack from './FeedbackSwipeStack';
import FeedbackListStack from './FeedbackListStack';

// Stacks for each tab
const tabs = {
  FeedbackSubmit: FeedbackSubmitStack,
  //FeedbackSwipe: FeedbackSwipeStack,
  FeedbackList: FeedbackListStack,
};

// Tab options
const options = {
  swipeEnabled: false,
  backBehavior: 'none',
  lazy: true,
  tabBarPosition: 'bottom',
  tabBarOptions: {
    showIcon: true,
    style: { backgroundColor: 'white' },
    indicatorStyle: { backgroundColor: '#00A2FF' },
    tabStyle: { margin: 0, padding: 8, height: 55 },
    labelStyle: { margin: 0, padding: 0, fontSize: 11 },
    activeTintColor: '#00A2FF',
    inactiveTintColor: 'grey',
  },
};

const NavTabs = TabNavigator(tabs, options);

export default NavTabs;
