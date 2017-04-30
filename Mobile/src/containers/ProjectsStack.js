// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';

// Import Scenes
import Projects from '../scenes/Projects';
import ProjectDetails from '../scenes/ProjectDetails';
import styles from '../styles/common/navStyles';


const ProjectsStack = StackNavigator({
  Projects: {
    screen: Projects,
    navigationOptions: {
      title: 'All Feedback',
      header: {
        style: { height: styles.header.height },
      },
    },
  },
  Details: {
    screen: ProjectDetails,
    navigationOptions: {
      title: 'Feedback Details',
      header: {
        style: { height: styles.header.height },
      },
    },
  },
});

export default ProjectsStack;
