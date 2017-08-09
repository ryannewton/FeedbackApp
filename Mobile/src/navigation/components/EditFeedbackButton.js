// Import Libraries
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import translate from '../../translation';

class EditFeedbackButton extends Component {
  render() {
    if (this.props.user.userId !== this.props.navigation.state.params.feedback.userId) {
      return null;
    }
    return (
      <TouchableOpacity
        style={{ width: 50 }}
        onPress={() => this.props.navigation.navigate('FeedbackSubmit', { language: translate(this.props.user.language).EDIT_FEEDBACK, feedback: this.props.navigation.state.params.feedback})}
      >
        <Icon name="edit" size={25} color="white" />
      </TouchableOpacity>
    );
  }
}
function mapStateToProps(state) {
  const { user, feedback } = state;
  return { user, feedback };
}
export default connect(mapStateToProps)(EditFeedbackButton);
