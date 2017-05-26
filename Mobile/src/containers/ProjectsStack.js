// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

// Import Scenes
import Projects from '../scenes/Projects';
import ProjectDetails from '../scenes/ProjectDetails';
import styles from '../styles/common/navStyles';


const ProjectsStackScenes = StackNavigator({
  Projects: {
    screen: Projects,
    navigationOptions: {
      title: 'All Feedback',
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
});

const ProjectsStack = {
  screen: ProjectsStackScenes,
  navigationOptions: {
    tabBarLabel: 'All Feedback',
    tabBarIcon: ({ tintColor }) => <Icon name="view-list" size={22} color={tintColor} />,
    cardStack: {
      gesturesEnabled: false,
    },
  },
};

export default ProjectsStack;
