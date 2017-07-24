// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

// Import Scenes, header buttons & Styles
import FeedbackSubmitHeaderButtons from './components/FeedbackSubmitHeaderButtons';
import FeedbackSubmit from '../scenes/FeedbackSubmit';
import Settings from '../scenes/Settings';
import Submitted from '../scenes/Submitted';
import styles from '../styles/common/navStyles';

// Stack of scenes
const scenes = StackNavigator(
  {
    FeedbackSubmit: {
      screen: FeedbackSubmit,
      navigationOptions: ({ navigation }) => ({
        title: 'navigation.state.params',
        headerRight: <FeedbackSubmitHeaderButtons navigation={navigation} />,
        headerTitleStyle: {
          color: '#fff',
          fontWeight: 'bold',
        },
        headerStyle: {
          height: styles.header.height,
          marginTop: styles.header.marginTop,
          backgroundColor: '#00A2FF',
        },
        headerTintColor: 'white',
      }),
    },
    Settings: {
      screen: Settings,
      navigationOptions: ({ navigation }) => ({
        title: 'navigation.state.params',
        headerTitleStyle: { color: '#fff' },
        headerStyle: {
          height: styles.header.height,
          marginTop: styles.header.marginTop,
          backgroundColor: '#00A2FF',
        },
        headerTintColor: 'white',
      })
    },
    Submitted: {
      screen: Submitted,
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params,
        headerTitleStyle: { color: '#fff' },
        headerStyle: {
          height: styles.header.height,
          marginTop: styles.header.marginTop,
          backgroundColor: '#00A2FF',
        },
        headerTintColor: 'white',
      })
    },
  },
);

// Stack options
const options = {
  tabBarLabel: 'Submit Feedback',
  tabBarIcon: ({ tintColor }) => <Icon name="create" size={22} color={tintColor} />,
  cardStack: { gesturesEnabled: false },
};

const FeedbackSubmitStack = {
  screen: scenes,
  navigationOptions: options,
};

export default FeedbackSubmitStack;
