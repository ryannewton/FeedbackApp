// Import Libraries
import React from 'react';
import { TouchableOpacity, View, Alert, Linking, Platform } from 'react-native';
import { Icon } from 'react-native-elements';

const TEXT_INTRO = 'Join me on Suggestion Box!\n\nGROUP CODE: ';
const APP_STORE_URL = 'https://appurl.io/j4kj90r2';

function FeedbackSubmitHeaderButtons(navigation) {
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
  const textLink = buildTextLink(groupAuthCode);

  return (
    Alert.alert(
      'Invite others',
      'Help others in your community voice their feedback through Suggestion Box.',
      [
        { text: 'Dismiss' },
        {
          text: 'Share',
          onPress: () => {
            Linking.openURL(textLink)
            .catch(error => console.log('Error running shareAppAlert(): ', error));
          },
        },
      ],
      { cancelable: true },
    )
  );
}

function buildTextLink(groupAuthCode) {
  let textLink = '';
  const message = `${TEXT_INTRO}${groupAuthCode}\n\n `;

  // Use percent-encoding for Android
  if (Platform.OS === 'android') {
    textLink = `sms:?body=${encodeURIComponent(message)}${APP_STORE_URL}`;
  } else {
    textLink = `sms:&body=${message}${APP_STORE_URL}`;
  }
  return textLink;
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

export default FeedbackSubmitHeaderButtons;
