// Import Libraries
import React from 'react';
import { Image } from 'react-native';
import { StackNavigator } from 'react-navigation';

// Import Scenes
import NewProjects from '../scenes/NewProjects';
import ProjectDetails from '../scenes/ProjectDetails';
import styles from '../styles/common/navStyles';

// Import icons
import NewProjectsSelected from '../../images/icons/newprojects2-selected_100px.png';
import NewProjectsNotSelected from '../../images/icons/newprojects2-notselected_100px.png';

const NewProjectsStackScreens = StackNavigator(
  {
    NewProjects: {
      screen: NewProjects,
      navigationOptions: {
        title: 'New Feedback',
        headerStyle: { height: styles.header.height },
      },
    },
    Details: {
      screen: ProjectDetails,
      navigationOptions: {
        title: 'Feedback Details',
        headerStyle: { height: styles.header.height },
      },
    },
  },
);

const NewProjectsStack = {
  screen: NewProjectsStackScreens,
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
};

export default NewProjectsStack;
