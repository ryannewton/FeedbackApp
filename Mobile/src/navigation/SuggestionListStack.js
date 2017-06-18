// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

// Import Scenes
import SuggestionList from '../scenes/SuggestionList';
import SuggestionDetails from '../scenes/SuggestionDetails';
import styles from '../styles/common/navStyles';

// Stack of scenes
const scenes = StackNavigator({
  SuggestionList: {
    screen: SuggestionList,
    navigationOptions: {
      title: 'All Suggestion',
      headerStyle: {
        height: styles.header.height,
        marginTop: styles.header.marginTop,
      },
    },
  },
  Details: {
    screen: SuggestionDetails,
    navigationOptions: {
      title: 'Suggestion Details',
      headerStyle: {
        height: styles.header.height,
        marginTop: styles.header.marginTop,
      },
    },
  },
});

// Stack options
const options = {
  tabBarLabel: 'All Suggestion',
  tabBarIcon: ({ tintColor }) => <Icon name="view-list" size={22} color={tintColor} />,
  cardStack: { gesturesEnabled: false },
};

const SuggestionListStack = {
  screen: scenes,
  navigationOptions: options,
};

export default SuggestionListStack;
