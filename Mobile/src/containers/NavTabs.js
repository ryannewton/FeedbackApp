// Import Libraries
import React from 'react';
import { Image } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

// Import Stacks
import FeedbackStack from './FeedbackStack';
import NewProjectsStack from './NewProjectsStack';
import ProjectsStack from './ProjectsStack';

// Import icons
import NewProjectsSelected from '../../images/icons/newprojects2-selected_100px.png';
import NewProjectsNotSelected from '../../images/icons/newprojects2-notselected_100px.png';

const NavTabs = TabNavigator(
  {
    Feedback: {
      screen: FeedbackStack,
      navigationOptions: {
        tabBarLabel: 'Submit Feedback',
        tabBarIcon: ({ tintColor }) => <Icon name="create" size={22} color={tintColor} />,
        cardStack: {
          gesturesEnabled: false,
        },
      },
    },
    NewProjects: {
      screen: NewProjectsStack,
      navigationOptions: {
        tabBarLabel: 'New Feedback',
        tabBarIcon: ({ tintColor }) => {
          if (tintColor === 'grey') {
            return <Image source={NewProjectsNotSelected} style={{ width: 22, height: 22 }} />;
          }
          return <Image source={NewProjectsSelected} style={{ width: 22, height: 22 }} />;
        },
        cardStack: {
          gesturesEnabled: false,
        },
      },
    },
    ProjectsStack: {
      screen: ProjectsStack,
      navigationOptions: {
        tabBarLabel: 'All Feedback',
        tabBarIcon: ({ tintColor }) => <Icon name="view-list" size={22} color={tintColor} />,
        cardStack: {
          gesturesEnabled: false,
        },
      },
    },
  },
  {
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
  },
);

export default NavTabs;
