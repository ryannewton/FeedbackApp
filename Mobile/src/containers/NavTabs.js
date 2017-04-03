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
        tabBar: {
          label: 'Feedback',
          icon: ({ tintColor }) => <Icon name="create" size={22} color={tintColor} />,
        },
      },
    },
    NewProjects: {
      screen: NewProjectsStack,
      navigationOptions: {
        tabBar: {
          label: 'New Projects',
          icon: ({ tintColor }) => {
            if (tintColor === 'grey') {
              return <Image source={NewProjectsNotSelected} style={{ width: 22, height: 22 }} />;
            }
            return <Image source={NewProjectsSelected} style={{ width: 22, height: 22 }} />;
          },
        },
      },
    },
    ProjectsStack: {
      screen: ProjectsStack,
      navigationOptions: {
        tabBar: {
          label: 'Projects',
          icon: ({ tintColor }) => <Icon name="view-list" size={22} color={tintColor} />,
        },
      },
    },
  },
  {
    swipeEnabled: false,
    // tabBarPosition: 'bottom',
    tabBarOptions: {
      showIcon: true,
      style: { backgroundColor: 'white' },
      indicatorStyle: { backgroundColor: '#b6001e' },
      tabStyle: { margin: 0, padding: 8, height: 55 },
      labelStyle: { margin: 0, padding: 0, fontSize: 11 },
      activeTintColor: '#b6001e',
      inactiveTintColor: 'grey',
      // iOS only options
      // activeBackgroundColor: 'yellow',
      // inactiveBackgroundColor: 'green',
    },
  },
);

export default NavTabs;
