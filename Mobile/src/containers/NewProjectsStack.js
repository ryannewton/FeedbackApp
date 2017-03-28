// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';

// Import Scenes
import NewProjects from '../scenes/NewProjects';

const NewProjectsStack = StackNavigator({
  NewProjects: {
    screen: NewProjects,
    navigationOptions: {
      title: 'New Projects',
      header: {
        style: { height: 45 },
      },
    },
  },
});

export default NewProjectsStack;
