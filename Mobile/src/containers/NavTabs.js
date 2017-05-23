// Import Libraries
import React from 'react';
import { TabNavigator } from 'react-navigation';

// Import Stacks
import FeedbackStack from './FeedbackStack';
import NewProjectsStack from './NewProjectsStack';
import ProjectsStack from './ProjectsStack';

const NavTabOptions = {
  swipeEnabled: false,
  backBehavior: 'none',
  // tabBarPosition: 'bottom',
  tabBarOptions: {
    showIcon: true,
    style: { backgroundColor: 'white' },
    indicatorStyle: { backgroundColor: '#A41034' },
    tabStyle: { margin: 0, padding: 8, height: 55 },
    labelStyle: { margin: 0, padding: 0, fontSize: 11 },
    activeTintColor: '#A41034',
    inactiveTintColor: 'grey',
    // iOS only options
    // activeBackgroundColor: 'yellow',
    // inactiveBackgroundColor: 'green',
  },
};

const NavTabs = TabNavigator(
  {
    Feedback: FeedbackStack,
    NewProjects: NewProjectsStack,
    ProjectsStack,
  },
  NavTabOptions,
);

export default NavTabs;
