// Import Libraries
import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

// Import Components
import DeleteFeedbackButton from './DeleteFeedbackButton';
import EditFeedbackButton from './EditFeedbackButton';
import SendInviteTextButton from './SendInviteTextButton';

const FeedbackDetailsHeaderButtons = (props) => {
  const { navigation } = props;
  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={{ paddingRight: 8 }}>
        <SendInviteTextButton navigation={navigation} />
      </View>
      <DeleteFeedbackButton navigation={navigation} />
      <EditFeedbackButton navigation={navigation} />
    </View>
  );
};

FeedbackDetailsHeaderButtons.propTypes = {
  navigation: PropTypes.object,
};

export default FeedbackDetailsHeaderButtons;
