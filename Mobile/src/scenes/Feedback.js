// Import Libraries
import React, { Component } from 'react';
import { View, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { MenuContext } from 'react-native-menu';

// Import actions
import { feedbackChanged, submitFeedbackToServer, navigate } from '../actions';

// Import components, functions, and styles
import RequireAuth from '../components/RequireAuth';
import { Button, HeaderPlusMenu, Spinner } from '../components/common';
import Submitted from './Submitted';
import styles from '../styles/styles_main';

class Feedback extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      height: 0,
    };
  }

  submitFeedback() {
    const scene = { key: 'Submitted', component: Submitted };
    const route = { type: 'push', route: scene };
    this.props.submitFeedbackToServer(route);
  }

  renderButton() {
    if (this.props.loading) {
      return <Spinner size="large" style={{ justifyContent: 'flex-start', marginTop: 20 }} />;
    }
    return (
      <Button onPress={this.submitFeedback.bind(this)}>
        Submit Feedback
      </Button>
    );
  }

  render() {
    const placeholderText = 'Enter your feedback here. We will work on addressing it with the appropriate administrator!';

    return (
      <MenuContext style={{ flex: 1 }} ref="MenuContext">
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <HeaderPlusMenu navigate={this.props.navigate}>
              Enter your feedback here
            </HeaderPlusMenu>

            {/* Feedback input box */}
            <TextInput
              multiline={Boolean(true)}
              onChangeText={feedback => this.props.feedbackChanged(feedback)}
              onContentSizeChange={(event) => {
                this.setState({ height: event.nativeEvent.contentSize.height });
              }}
              style={styles.feedback_input}
              placeholder={placeholderText}
              value={this.props.feedback}
            />

            {/* Submit button / loading spinner */}
            {this.renderButton()}
          </View>
        </TouchableWithoutFeedback>
      </MenuContext>
    );
  }
}

Feedback.propTypes = {
  feedbackChanged: React.PropTypes.func,
  submitFeedbackToServer: React.PropTypes.func,
  navigate: React.PropTypes.func,
  feedback: React.PropTypes.string,
  loading: React.PropTypes.bool,
};

function mapStateToProps(state) {
  const { feedback, loading } = state.main;
  return { feedback, loading };
}

export default connect(mapStateToProps, {
  feedbackChanged,
  submitFeedbackToServer,
  navigate,
})(RequireAuth(Feedback));
