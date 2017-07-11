// Import Libraries
import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

// Import Components
import SendInviteTextButton from './SendInviteTextButton';
import SettingsButton from './SettingsButton';

const FeedbackSubmitHeaderButtons = (props) => {
  const { navigation } = props;
  return (
    <View style={{ flexDirection: 'row' }}>
      <SendInviteTextButton navigation={navigation} />
      <SettingsButton navigation={navigation} />
    </View>
  );
};

FeedbackSubmitHeaderButtons.propTypes = {
  navigation: PropTypes.object,
};

export default FeedbackSubmitHeaderButtons;
