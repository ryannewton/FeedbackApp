// Import Libraries
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import translate from '../../translation';

// Import actions
import {
  updateFeedbackText,
  updateImageURL,
  updateCategory,
  updateFeedbackType,
  updateErrorMessage,
  editingFeedback,
} from '../../actions';

class EditFeedbackButton extends Component {
  stageFeedbackToState() {
    const { feedback } = this.props.navigation.state.params;
    this.props.updateFeedbackText(feedback.text);
    this.props.updateImageURL(feedback.imageURL);
    this.props.updateCategory(feedback.category);
    this.props.updateFeedbackType(feedback.type);
    this.props.updateErrorMessage(feedback.errorMessage);
    this.props.editingFeedback();
  }

  render() {
    const { user } = this.props;
    const { feedback } = this.props.navigation.state.params;
    if (user.userId !== feedback.userId) {
      return null;
    }
    return (
      <TouchableOpacity
        style={{ width: 50 }}
        onPress={() => {
          const submitScene = this.props.group.includePositiveFeedbackBox ? 'FeedbackSubmitSplit' : 'FeedbackSubmit';
          this.stageFeedbackToState();
          this.props.navigation.navigate(submitScene, { language: translate(user.language).EDIT_FEEDBACK, feedback });
        }}
      >
        <Icon name="edit" size={25} color="white" />
      </TouchableOpacity>
    );
  }
}
function mapStateToProps(state) {
  const { user, group } = state;
  return { user, group };
}

EditFeedbackButton.propTypes = {
  user: PropTypes.object,
  feedback: PropTypes.object,
  group: PropTypes.object,
  navigation: PropTypes.object,
  updateFeedbackText: PropTypes.func,
  updateImageURL: PropTypes.func,
  updateCategory: PropTypes.func,
  updateFeedbackType: PropTypes.func,
  updateErrorMessage: PropTypes.func,
  editingFeedback: PropTypes.func,
};

export default connect(mapStateToProps, {
  updateFeedbackText,
  updateImageURL,
  updateCategory,
  updateFeedbackType,
  updateErrorMessage,
  editingFeedback,
})(EditFeedbackButton);
