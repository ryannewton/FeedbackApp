// Import Libraries
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

// Import Scenes
import Feedback from '../scenes/Feedback';
import Settings from '../scenes/Settings';
import Submitted from '../scenes/Submitted';
import styles from '../styles/common/navStyles';


function settingsButton(navigate) {
  const right = (
    <TouchableOpacity
      style={{ width: 50 }}
      onPress={() => navigate('Settings')}
    >
      <Icon name="settings" size={25} />
    </TouchableOpacity>
  );

  return right;
}

const FeedbackStack = StackNavigator(
  {
    Feedback: {
      screen: Feedback,
      navigationOptions: {
        title: 'Send Feedback',
        header: ({ navigate }) => ({
          right: settingsButton(navigate),
          style: { height: styles.header.height },
        }),
      },
    },
    Settings: {
      screen: Settings,
      navigationOptions: {
        title: 'Settings',
        header: {
          style: { height: styles.header.height },
        },
      },
    },
    Submitted: {
      screen: Submitted,
      navigationOptions: {
        title: 'Feedback Received',
        header: {
          style: { height: styles.header.height },
        },
      },
    },
  },
);

export default FeedbackStack;
