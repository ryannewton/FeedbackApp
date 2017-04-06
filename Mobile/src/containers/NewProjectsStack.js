// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';

// Import Scenes
import NewProjects from '../scenes/NewProjects';
import ProjectDetails from '../scenes/ProjectDetails';

const NewProjectsStack = StackNavigator({
  NewProjects: {
    screen: NewProjects,
    navigationOptions: {
      title: 'New Projects',
      header: {
        visible: false,
      },
    },
  },
  Details: {
    screen: ProjectDetails,
    navigationOptions: {
      title: 'Project Details',
      header: {
        style: { height: 45 },
      },
    },
  },
});

export default NewProjectsStack;
