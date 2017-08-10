// Import Libraries
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import {
  submitFeedbackToServer,
  updateFeedbackToServer,
} from '../../actions';

class SendFeedbackButton extends Component {
    submitFeedback = () => {
    const { feedback, group, navigation, user } = this.props;
    if (!feedback.text) {
      this.props.updateErrorMessage('Feedback box cannot be blank. Sorry!');
      return null;
    }
      
    // Search for restricted words
    if (group.bannedWords.test(feedback.text.toLowerCase())) {
      this.props.updateErrorMessage('One or more words in your feedback is restricted by your administrator. Please edit and resubmit.');
      return null;
    }

    if (feedback.editing) {
      this.props.updateFeedbackToServer(group.feedbackRequiresApproval, feedback.text, feedback.type, feedback.imageURL || '', feedback.category, navigation.state.params.feedback);
    } else {
      this.props.submitFeedbackToServer(group.feedbackRequiresApproval, feedback.text, feedback.type, feedback.imageURL || '', feedback.category);    
    }

    navigation.navigate('Submitted', translate(user.language).FEEDBACK_RECIEVED);
  }

  render() {
    const { group, feedback } = this.props;
    return (
      <TouchableOpacity
        style={{ width: 40 }}
        onPress={() => {
          this.submitFeedback();
          this.props.navigation.navigate('Submitted');
        }}
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
})(SendFeedbackButton);
