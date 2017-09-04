// Import Libraries
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import translate from '../../translation';

import {
  submitFeedbackToServer,
  updateFeedbackToServer,
  updateErrorMessage,
} from '../../actions';

class SendFeedbackButton extends Component {
  submitFeedback = () => {
    const { feedback, group, navigation, user } = this.props;
    if (!feedback.text) {
      this.props.updateErrorMessage(translate(this.props.user.language).FEEDBACK_CANT_BE_BLANK);
    }
      
    // Search for restricted words
    else if (group.bannedWords.test(feedback.text.toLowerCase())) {
      this.props.updateErrorMessage(translate(this.props.user.language).RESTRICTED_WORD);
    }

    else if (feedback.editing) {
      this.props.updateFeedbackToServer(group.feedbackRequiresApproval, feedback.text, feedback.type, feedback.imageURL || '', feedback.category, navigation.state.params.feedback);
      navigation.navigate('Submitted', translate(user.language).FEEDBACK_RECIEVED);
    }

    else {
      this.props.submitFeedbackToServer(group.feedbackRequiresApproval, feedback.text, feedback.type, feedback.imageURL || '', feedback.category);    
      navigation.navigate('Submitted', translate(user.language).FEEDBACK_RECIEVED);
    }
  }

  render() {
    const { group, feedback } = this.props;
    return (
      <TouchableOpacity
        style={{ width: 40 }}
        onPress={this.submitFeedback}
      >
        <Icon name="send" size={25} color="white" />
      </TouchableOpacity>
    );
  }
}

SendFeedbackButton.propTypes = {
  user: PropTypes.object,
  group: PropTypes.object,
  feedback: PropTypes.object,
  navigate: PropTypes.object,
  submitFeedbackToServer: PropTypes.func,
  updateFeedbackToServer: PropTypes.func,
};

function mapStateToProps(state) {
  const { user, group, feedback } = state;
  return { user, group, feedback };
}

export default connect(mapStateToProps, {
  submitFeedbackToServer,
  updateFeedbackToServer,
  updateErrorMessage,
})(SendFeedbackButton);
