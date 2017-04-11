// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';

// Import Scenes
import NewProjects from '../scenes/NewProjects';
import ProjectDetails from '../scenes/ProjectDetails';
import styles from '../styles/common/navStyles';

const NewProjectsStack = StackNavigator(
  {
    NewProjects: {
      screen: NewProjects,
      navigationOptions: {
        title: 'New Projects',
        header: {
          visible: false,
          style: { height: styles.header.height },
        },
      },
    },
    Details: {
      screen: ProjectDetails,
      navigationOptions: {
        title: 'Project Details',
        header: {
          style: { height: styles.header.height },
        },
      },
    },
  },
);

export default NewProjectsStack;
