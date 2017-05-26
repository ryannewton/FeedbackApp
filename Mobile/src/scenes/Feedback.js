// Import Libraries
import React, { Component } from 'react';
import { View, TextInput, Keyboard, TouchableWithoutFeedback, Image, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import { MenuContext } from 'react-native-menu';

// Import actions
import { feedbackChanged, submitFeedbackToServer, closeInstructions } from '../actions';

// Import components, functions, and styles
import { Button, Spinner } from '../components/common';
import styles from '../styles/styles_main';

// Import about info image
import styles2 from '../styles/scenes/FullscreenStyle';
import fullScreen from '../../images/backgrounds/FeedbackInfo.jpg';

// Import tracking
import { tracker } from '../constants';

class Feedback extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      height: 0,
      errorMessage: '',
    };

    tracker.trackScreenViewWithCustomDimensionValues('Feedback', { domain: props.features.domain });

    this.closeInstructions = this.closeInstructions.bind(this);
    this.submitFeedback = this.submitFeedback.bind(this);
  }

  submitFeedback() {
    // First we search the feedback for restricted words
    // We actually want to download a list of words from a database and convert those into an RE which we store in feedback and pull in here
    if (this.props.features.bannedWords.test(this.props.feedback.feedback)) {
      // If restricted words then we show an error to the user
      this.setState({ errorMessage: 'One or more words in your feedback is restricted by your administrator. Please edit and resubmit.' });
    } else {
      // If no restricted words then we continue
      this.props.submitFeedbackToServer(this.props.features.moderatorApproval);
      tracker.trackEvent('Submit', 'Submit Feedback', { label: this.props.features.domain });
      this.setState({ errorMessage: '' });
      this.props.navigation.navigate('Submitted');
    }
  }

  closeInstructions() {
    this.props.closeInstructions('Write Feedback Scene');
  }

  renderButton() {
    if (this.props.feedback.loading) {
      return <Spinner size="large" style={{ justifyContent: 'flex-start', marginTop: 20 }} />;
    }
    return (
      <Button onPress={this.submitFeedback}>
        Submit Feedback
      </Button>
    );
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
                value={this.props.feedback.feedback}
              />

              {/* Error message (blank if no error) */}
              <Text style={styles.errorTextStyle}>
                {this.state.errorMessage}
              </Text>

              {/* Submit button / loading spinner */}
              {this.renderButton()}
            </View>
          </TouchableWithoutFeedback>
        </MenuContext>
      </View>
    );

    const screenToShow = (!this.props.user.instructionsViewed.includes('Write Feedback Scene')) ? instructionsScreen : WriteFeedbackScene;
    return screenToShow;
  }
}

Feedback.propTypes = {
  user: React.PropTypes.object,
  features: React.PropTypes.object,
  feedback: React.PropTypes.object,
  feedbackChanged: React.PropTypes.func,
  submitFeedbackToServer: React.PropTypes.func,
  closeInstructions: React.PropTypes.func,
  navigation: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { user, features, feedback } = state;
  return { user, features, feedback };
}

export default connect(mapStateToProps, {
  feedbackChanged,
  submitFeedbackToServer,
  closeInstructions,
})(Feedback);
