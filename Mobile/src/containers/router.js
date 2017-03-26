// Import Libraries
import React from 'react';
import { View } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

// Import Scenes
import Feedback from '../scenes/Feedback';
import NewProjects from '../scenes/NewProjects';
import Projects from '../scenes/Projects';
import ProjectDetails from '../scenes/ProjectDetails';
import Settings from '../scenes/Settings';

// Import Components
import { Button } from '../components/common';

export const ProjectsStack = StackNavigator({
  Projects: {
    screen: Projects,
    navigationOptions: {
      title: 'Projects',
    },
  },
  Details: {
    screen: ProjectDetails,
    navigationOptions: {
      title: 'Project Details',
    },
  },
});

function settingsButton({ state, setParams }) {
  let right = (
    <View style={{ width: 80 }}>
      <Button onPress={() => setParams({ mode: 'settings' })} >
        Settings
      </Button>
    </View>
  );
  if (state.params.mode === 'settings') {
    right = (
      <View style={{ width: 80 }}>
        <Button onPress={() => setParams({ mode: 'none' })} >
          Done
        </Button>
      </View>
    );
  }

  return { right };
}

export const FeedbackStack = StackNavigator({
  Feedback: {
    screen: Feedback,
    navigationOptions: {
      title: 'Send Feedback',
      header: settingsButton,
    },
  },
});

export const NewProjectsStack = StackNavigator({
  NewProjects: {
    screen: NewProjects,
    navigationOptions: {
      title: 'New Projects',
    },
  },
});

export const Tabs = TabNavigator({
  Feedback: {
    screen: FeedbackStack,
    navigationOptions: {
      tabBar: {
        label: 'Feedback',
      },
    },
  },
  NewProjects: {
    screen: NewProjectsStack,
    navigationOptions: {
      tabBar: {
        label: 'New Projects',
      },
    },
  },
  ProjectsStack: {
    screen: ProjectsStack,
  },
});

export const Root = StackNavigator({
  Tabs: {
    screen: Tabs,
  },
  Settings: {
    screen: Settings,
  },
}, {
  mode: 'modal',
  headerMode: 'none',
});
