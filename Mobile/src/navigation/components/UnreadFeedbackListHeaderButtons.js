// Import Libraries
import React from 'react';
import { View } from 'react-native';
import SendInviteTextButton from './SendInviteTextButton';

function UnreadFeedbackListHeaderButtons(navigation) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {SendInviteTextButton(navigation)}
    </View>
  );
}

export default UnreadFeedbackListHeaderButtons;
