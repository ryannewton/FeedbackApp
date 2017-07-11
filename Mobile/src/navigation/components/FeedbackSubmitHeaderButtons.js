// Import Libraries
import React, { Component } from 'react';
import { View } from 'react-native';
import SendInviteTextButton from './SendInviteTextButton';
import SettingsButton from './SettingsButton';

class FeedbackSubmitHeaderButtons extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flexDirection: 'row' }}>
        <SendInviteTextButton navigation={navigation} />
        <SettingsButton navigation={navigation} />
      </View>
    );
  }
}

export default FeedbackSubmitHeaderButtons;
