// Import Libraries
import React from 'react';
import { TabNavigator } from 'react-navigation';

// Import Stacks
import SuggestionSubmitStack from './SuggestionSubmitStack';
import SuggestionSwipeStack from './SuggestionSwipeStack';
import SuggestionListStack from './SuggestionListStack';

// Stacks for each tab
const tabs = {
  SuggestionSubmit: SuggestionSubmitStack,
  SuggestionSwipe: SuggestionSwipeStack,
  SuggestionList: SuggestionListStack,
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
    indicatorStyle: { backgroundColor: '#A41034' },
    tabStyle: { margin: 0, padding: 8, height: 55 },
    labelStyle: { margin: 0, padding: 0, fontSize: 11 },
    activeTintColor: '#A41034',
    inactiveTintColor: 'grey',
  },
};

const NavTabs = TabNavigator(tabs, options);

export default NavTabs;
