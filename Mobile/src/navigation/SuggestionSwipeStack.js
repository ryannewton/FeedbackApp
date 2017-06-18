// Import Libraries
import React from 'react';
import { Image } from 'react-native';
import { StackNavigator } from 'react-navigation';

// Import Scenes
import SuggestionSwipe from '../scenes/SuggestionSwipe';
import SuggestionDetails from '../scenes/SuggestionDetails';
import styles from '../styles/common/navStyles';

// Import icons
import SuggestionSwipeSelected from '../../images/icons/newprojects2-selected_100px.png';
import SuggestionSwipeNotSelected from '../../images/icons/newprojects2-notselected_100px.png';

// Stack of scenes
const scenes = StackNavigator(
  {
    SuggestionSwipe: {
      screen: SuggestionSwipe,
      navigationOptions: {
        title: 'New Suggestion',
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
  },
);

// Stack options
const options = {
  tabBarLabel: 'New Suggestion',
  tabBarIcon: ({ tintColor }) => {
    if (tintColor === 'grey') {
      return <Image source={SuggestionSwipeNotSelected} style={{ width: 22, height: 22 }} />;
    }
    return <Image source={SuggestionSwipeSelected} style={{ width: 22, height: 22 }} />;
  },
  cardStack: {
    gesturesEnabled: false,
  },
};

const SuggestionSwipeStack = {
  screen: scenes,
  navigationOptions: options,
};

export default SuggestionSwipeStack;
