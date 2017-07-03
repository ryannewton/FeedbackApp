// Import Libraries
import React from 'react';
import { TouchableOpacity, View, Alert, Linking } from 'react-native';
import { Icon } from 'react-native-elements';

const TEXT_INTRO = 'sms:&body=Join me on Suggestion Box!\n\nGROUP CODE: ';
const APP_STORE_URL = 'https://appurl.io/j4kj90r2';

function FeedbackSubmitButtons(navigation) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {shareAppButton(navigation)}
      {settingsButton(navigation)}
    </View>
  );
}

function shareAppButton(navigation) {
  return (
    <TouchableOpacity
      sytle={{ width: 50 }}
      onPress={() => shareAppAlert(navigation)}
    >
      <Icon name="share" size={25} color="white" />
    </TouchableOpacity>
  );
}

function shareAppAlert(navigation) {
  const { groupAuthCode } = navigation.state.params;

  return (
    Alert.alert(
      'Invite others',
      'Help others in your community voice their feedback through Suggestion Box.',
      [
        { text: 'Dismiss' },
        { text: 'Share', onPress: () => Linking.openURL(`${TEXT_INTRO}${groupAuthCode}\n${APP_STORE_URL}`) },

      ],
      { cancelable: true },
    )
  );
}

function settingsButton(navigation) {
  return (
    <TouchableOpacity
      style={{ width: 50 }}
      onPress={() => navigation.navigate('Settings')}
    >
      <Icon name="settings" size={25} color="white" />
    </TouchableOpacity>
  );
}

export default FeedbackSubmitButtons;
