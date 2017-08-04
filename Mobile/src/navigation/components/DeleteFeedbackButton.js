// Import Libraries
import React, { Component } from 'react';
import { TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import translate from '../../translation'
import { deleteFeedback } from '../../actions';

class DeleteFeedbackButton extends Component {
  deleteAlert = () => {
    const { language } = this.props.user;
    const { DELETE_FEEDBACK,
            DELETE_FEEDBACK_BODY,
            CANCEL,
            DELETE,
          } = translate(language);

    return (
      Alert.alert(
        DELETE_FEEDBACK,
        DELETE_FEEDBACK_BODY,
        [
          { text: CANCEL },
          {
            text: DELETE,
            onPress: () => {
              this.props.deleteFeedback(this.props.navigation.state.params.feedback);
              this.props.navigation.navigate('Main');
            },
          },
        ],
        { cancelable: true },
      )
    );
  }

  render() {
    if (this.props.user.userId !== this.props.navigation.state.params.feedback.userId) {
      return null;
    }
    return (
      <TouchableOpacity
        sytle={{ width: 50}}
        onPress={() => this.deleteAlert(this.props.navigation)}
      >
        <Icon name="delete" size={25} color="white" />
      </TouchableOpacity>
    );
  }
}

function mapStateToProps(state) {
  const { user, feedback } = state;
  return { user, feedback };
}
export default connect(mapStateToProps, {
  deleteFeedback,
})(DeleteFeedbackButton);
