// Import Libraries
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

// Import Scenes
import FeedbackSubmit from '../scenes/FeedbackSubmit';
import Settings from '../scenes/Settings';
import Submitted from '../scenes/Submitted';
import styles from '../styles/common/navStyles';

function settingsButton(navigate) {
  const right = (
    <TouchableOpacity
      style={{ width: 50 }}
      onPress={() => navigate('Settings')}
    >
      <Icon name="settings" size={25} color="white" />
    </TouchableOpacity>
  );

  return right;
}

// Stack of scenes
const scenes = StackNavigator(
  {
    FeedbackSubmit: {
      screen: FeedbackSubmit,
      navigationOptions: ({ navigation }) => ({
        title: 'Submit Feedback',
        headerRight: settingsButton(navigation.navigate),
      headerTitleStyle: {
        color: '#fff'
      },
      headerStyle: {
        height: styles.header.height,
        marginTop: styles.header.marginTop,
        backgroundColor: '#00A2FF',
      },
      }),
    },
    Settings: {
      screen: Settings,
      navigationOptions: {
        title: 'Settings',
      headerTitleStyle: {
        color: '#fff'
      },
      headerStyle: {
        height: styles.header.height,
        marginTop: styles.header.marginTop,
        backgroundColor: '#00A2FF',
      },
      },
    },
    Submitted: {
      screen: Submitted,
      navigationOptions: {
        title: 'Feedback Received',
      headerTitleStyle: {
        color: '#fff'
      },
      headerStyle: {
        height: styles.header.height,
        marginTop: styles.header.marginTop,
        backgroundColor: '#00A2FF',
      },
      },
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
