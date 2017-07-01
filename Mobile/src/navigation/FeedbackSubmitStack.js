// Import Libraries
import React from 'react';
import { TouchableOpacity, View, Alert, Linking, Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

// Import Scenes
import FeedbackSubmit from '../scenes/FeedbackSubmit';
import Settings from '../scenes/Settings';
import Submitted from '../scenes/Submitted';
import styles from '../styles/common/navStyles';

function settingsButton(navigation) {
  const right = (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        sytle={{ width: 50 }}
        onPress={() => shareAppAlert(navigation)}
      >
        <Icon name="share" size={25} color="blue" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ width: 50 }}
        onPress={() => navigation.navigate('Settings')}
      >
        <Icon name="settings" size={25} color="white" />
      </TouchableOpacity>
    </View>
  );

  return right;
}

function shareAppAlert(navigation) {
  if (Platform.OS === 'ios') {
    return (
      Alert.alert(
        'Invite others',
        'Help others in your community voice their feedback through Suggestion Box.',
        [
          { text: 'Dismiss' },
          { text: 'Share', onPress: () => Linking.openURL(`sms:&body=Join me on Suggestion Box!\n\nGROUP CODE: ${navigation.state.params.groupAuthCode}\nhttps://appurl.io/j4kj90r2`) },

        ],
        { cancelable: true },
      )
    );
  }
  return (
    Alert.alert(
      'Share with your friends!',
      'Help your friends to voice their opinion by sharing Suggestion Box with them.',
      [
        { text: 'Cancel' },
        { text: 'Share!', onPress: () => Linking.openURL(`sms:&body=Join me on Suggestion Box!\n\nGROUP CODE: ${navigation.state.params.groupAuthCode}\nhttps://appurl.io/j4kj90r2`) },

      ],
      { cancelable: true },
    )
  );
}

// Stack of scenes
const scenes = StackNavigator(
  {
    FeedbackSubmit: {
      screen: FeedbackSubmit,
      navigationOptions: ({ navigation }) => ({
        title: 'Submit Feedback',
        headerRight: settingsButton(navigation),
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
