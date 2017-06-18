// Import Libraries
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

// Import Scenes
import SuggestionSubmit from '../scenes/SuggestionSubmit';
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

// Stack of scenes
const scenes = StackNavigator(
  {
    SuggestionSubmit: {
      screen: SuggestionSubmit,
      navigationOptions: ({ navigation }) => ({
        title: 'Submit Suggestion',
        headerRight: settingsButton(navigation.navigate),
        headerStyle: {
          height: styles.header.height,
          marginTop: styles.header.marginTop,
        },
      }),
    },
    Settings: {
      screen: Settings,
      navigationOptions: {
        title: 'Settings',
        headerStyle: {
          height: styles.header.height,
          marginTop: styles.header.marginTop,
        },
      },
    },
    Submitted: {
      screen: Submitted,
      navigationOptions: {
        title: 'Suggestion Received',
        headerStyle: {
          height: styles.header.height,
          marginTop: styles.header.marginTop,
        },
      },
    },
  },
);

// Stack options
const options = {
  tabBarLabel: 'Submit Suggestion',
  tabBarIcon: ({ tintColor }) => <Icon name="create" size={22} color={tintColor} />,
  cardStack: { gesturesEnabled: false },
};

const SuggestionSubmitStack = {
  screen: scenes,
  navigationOptions: options,
};

export default SuggestionSubmitStack;
