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

const FeedbackStackScreens = StackNavigator(
  {
    Feedback: {
      screen: Feedback,
      navigationOptions: ({ navigation }) => ({
        title: 'Submit Feedback',
        headerRight: settingsButton(navigation.navigate),
        headerStyle: { height: styles.header.height },
      }),
    },
    Settings: {
      screen: Settings,
      navigationOptions: {
        title: 'Settings',
        headerStyle: { height: styles.header.height },
      },
    },
    Submitted: {
      screen: Submitted,
      navigationOptions: {
        title: 'Feedback Received',
        headerStyle: { height: styles.header.height },
      },
    },
  },
);

const FeedbackStack = {
  screen: FeedbackStackScreens,
  navigationOptions: {
    tabBarLabel: 'Submit Feedback',
    tabBarIcon: ({ tintColor }) => <Icon name="create" size={22} color={tintColor} />,
    cardStack: {
      gesturesEnabled: false,
    },
  },
};

export default FeedbackStack;
