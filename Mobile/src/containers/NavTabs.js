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
// import FeedbackSelected from '../../images/icons/feedback2-selected_100px.png';
// import FeedbackNotSelected from '../../images/icons/feedback2-notselected_100px.png';
import NewProjectsSelected from '../../images/icons/newprojects2-selected_100px.png';
// import NewProjectsNotSelected from '../../images/icons/newprojects2-notselected_100px.png';
// import AllProjectsSelected from '../../images/icons/allprojects4-selected_100px.png';
// import AllProjectsNotSelected from '../../images/icons/allprojects4-notselected_100px.png';


const NavTabs = TabNavigator(
  {
    Feedback: {
      screen: FeedbackStack,
      navigationOptions: {
        tabBar: {
          label: 'Feedback',
          icon: ({ tintColor }) => <Icon name="create" size={22} color={tintColor} />,
          // icon: <Image source={FeedbackSelected} style={{ width: 22, height: 22 }} />,
        },
      },
    },
    NewProjects: {
      screen: NewProjectsStack,
      navigationOptions: {
        tabBar: {
          label: 'New Projects',
          // icon: ({ tintColor }) => <Icon name="mode-edit" size={22} color={tintColor} />,
          icon: <Image source={NewProjectsSelected} style={{ width: 22, height: 22 }} />,
        },
      },
    },
    ProjectsStack: {
      screen: ProjectsStack,
      navigationOptions: {
        tabBar: {
          label: 'Projects',
          icon: ({ tintColor }) => <Icon name="view-list" size={22} color={tintColor} />,
          // icon: <Image source={AllProjectsSelected} style={{ width: 22, height: 22 }} />,
        },
      },
    },
  },
  {
    swipeEnabled: false,
    // tabBarPosition: 'bottom',
    tabBarOptions: {
      showIcon: true,
      tabStyle: { margin: 0, padding: 8, height: 55 },
      labelStyle: { margin: 0, padding: 0, fontSize: 11 },
    },
  },
);

export default NavTabs;
