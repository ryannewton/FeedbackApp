// Import Libraries
import React from 'react';
import { View } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
// import { Icon } from 'react-native-elements';

// Import Scenes
import Feedback from '../scenes/Feedback';
import NewProjects from '../scenes/NewProjects';
import Projects from '../scenes/Projects';
import ProjectDetails from '../scenes/ProjectDetails';
import Settings from '../scenes/Settings';

// Import Components
import { Button } from '../components/common';

// Import icons
import FeedbackSelected from '../../images/icons/feedback2-selected_100px.png';
import FeedbackNotSelected from '../../images/icons/feedback2-notselected_100px.png';
import NewProjectsSelected from '../../images/icons/newprojects2-selected_100px.png';
import NewProjectsNotSelected from '../../images/icons/newprojects2-notselected_100px.png';
import AllProjectsSelected from '../../images/icons/allprojects4-selected_100px.png';
import AllProjectsNotSelected from '../../images/icons/allprojects4-notselected_100px.png';

function navButton(target, label, navigate) {
  const right = (
    <View style={{ width: 80 }}>
      <Button
        onPress={() => {
          navigate(target);
        }}
      >
        {label}
      </Button>
    </View>
  );

  return { right };
}

export const FeedbackStack = StackNavigator({
  Feedback: {
    screen: Feedback,
    navigationOptions: {
      title: 'Send Feedback',
      header: ({ navigate }) => navButton('Settings', 'Settings', navigate),
      icon: FeedbackSelected,
    },
  },
  Settings: {
    screen: Settings,
    navigationOptions: {
      title: 'Settings',
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
