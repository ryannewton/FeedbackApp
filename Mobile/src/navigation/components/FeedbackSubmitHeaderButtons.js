// Import Libraries
import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

// Import Components
import SendFeedbackButton from './SendFeedbackButton';
import SettingsButton from './SettingsButton';

const FeedbackSubmitHeaderButtons = (props) => {
  const { navigation } = props;
  return (
    <View style={{ flexDirection: 'row' }}>
      <SendFeedbackButton navigation={navigation} />
    </View>
  );
};

FeedbackSubmitHeaderButtons.propTypes = {
  navigation: PropTypes.object,
};

export default FeedbackSubmitHeaderButtons;
