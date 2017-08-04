// Import Libraries
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

// Import Scenes
import FeedbackSubmit from '../scenes/FeedbackSubmit';
import Settings from '../scenes/Settings';
import Submitted from '../scenes/Submitted';
import FeedbackList from '../scenes/FeedbackList';
import FeedbackDetails from '../scenes/FeedbackDetails';

// Import Components and styles
import FeedbackListHeader from './components/FeedbackListHeader';
import FeedbackSubmitHeaderButtons from './components/FeedbackSubmitHeaderButtons';
import FeedbackDetailsHeaderButtons from './components/FeedbackDetailsHeaderButtons';
import styles from '../styles/common/navStyles';

// Stack of scenes
const MainStack = StackNavigator({
  FeedbackList: {
    screen: FeedbackList,
    navigationOptions: ({ navigation }) => ({
      header: <FeedbackListHeader navigation={navigation} />,
      headerTintColor: 'white',
    }),
  },
  Details: {
    screen: FeedbackDetails,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.translate,
      headerRight: <FeedbackDetailsHeaderButtons navigation={navigation} />,
      headerTitleStyle: {
        color: '#fff',
      },
      headerStyle: {
        height: styles.header.height,
        marginTop: styles.header.marginTop,
        backgroundColor: '#00A2FF',
      },
      headerTintColor: 'white',
    }),
  },
  FeedbackSubmit: {
    screen: FeedbackSubmit,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.language,
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
});

export default MainStack;
