// Import Libraries
import React, { Component } from 'react';
import { View, TextInput, Keyboard, TouchableWithoutFeedback, Image, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { connect } from 'react-redux';
import { MenuContext } from 'react-native-menu';
import { NavigationActions } from 'react-navigation';

// Import actions
import { feedbackChanged, submitFeedbackToServer, closeInstructions } from '../actions';

// Import components, functions, and styles
import { Button, Spinner } from '../components/common';
import styles from '../styles/styles_main';

// Import about info image
import styles2 from '../styles/scenes/FullscreenStyle';
import fullScreen from '../../images/backgrounds/FeedbackInfo.jpg';

class Feedback extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      height: 0,
    };

    this.closeInstructions = this.closeInstructions.bind(this);
  }

  submitFeedback() {
    this.props.submitFeedbackToServer(this.props.moderatorApproval);
    this.props.navigation.navigate('Submitted');
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

  closeInstructions() {
    this.props.closeInstructions('Write Feedback Scene');
  }

  render() {
    const placeholderText = 'Enter your feedback here!';

    const instructionsScreen = (
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={this.closeInstructions} style={styles2.touchableOpacityStyle}>
          <Image style={styles2.image} source={fullScreen} resizeMode="cover" />
        </TouchableOpacity>
      </View>
    );

    const WriteFeedbackScene = (
      <View style={[styles.container, styles.swiper]}>
        <MenuContext style={{ flex: 1 }} ref="MenuContext">
          <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
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
      </View>
    );

    const screenToShow = (!this.props.user.instructionsViewed.includes('Write Feedback Scene')) ? instructionsScreen : WriteFeedbackScene;
    //const screenToShow = WriteFeedbackScene;

    return screenToShow;

  }
}

Feedback.propTypes = {
  feedbackChanged: React.PropTypes.func,
  submitFeedbackToServer: React.PropTypes.func,
  feedback: React.PropTypes.string,
  user: React.PropTypes.object,
  loading: React.PropTypes.bool,
  navigation: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { feedback, loading } = state.main;
  const { user } = state;
  const { moderatorApproval } = state.features;
  return { user, feedback, loading, moderatorApproval };
}

export default connect(mapStateToProps, {
  feedbackChanged,
  submitFeedbackToServer,
  closeInstructions,
})(Feedback);
