// Import Libraries
import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

// Import Components
import DeleteFeedbackButton from './DeleteFeedbackButton';
import EditFeedbackButton from './EditFeedbackButton';

const FeedbackDetailsHeaderButtons = (props) => {
  const { navigation } = props;
  return (
    <View style={{ flexDirection: 'row' }}>
      <DeleteFeedbackButton navigation={navigation} />
      <EditFeedbackButton navigation={navigation} />
    </View>
  );
};

FeedbackDetailsHeaderButtons.propTypes = {
  navigation: PropTypes.object,
};

export default FeedbackDetailsHeaderButtons;
