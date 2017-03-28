// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';

// Import Scenes
import Projects from '../scenes/Projects';
import ProjectDetails from '../scenes/ProjectDetails';


const ProjectsStack = StackNavigator({
  Projects: {
    screen: Projects,
    navigationOptions: {
      title: 'Projects',
      header: {
        style: { height: 45 },
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

export default ProjectsStack;
