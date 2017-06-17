// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MenuContext } from 'react-native-menu';
import { Icon } from 'react-native-elements';
import { ImagePicker } from 'expo';
import {
  View,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

// Import actions
import { submitFeedbackToServer, closeInstructions, uploadImage } from '../actions';

// Import components, functions, and styles
import { Button, Spinner } from '../components/common';

// Import about info image
import styles from '../styles/scenes/FeedbackSubmitStyles';
import fullScreen from '../../images/backgrounds/FeedbackInfo.jpg';

// Import tracking
// import { tracker } from '../constants';

class FeedbackSubmit extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      height: 0,
      errorMessage: '',
      feedback: '',
      positiveFeedback: '',
      negativeFeedback: '',
    };

    // tracker.trackScreenViewWithCustomDimensionValues('Feedback', { domain: props.features.domain });

    this.closeInstructions = this.closeInstructions.bind(this);
    this.submitFeedback = this.submitFeedback.bind(this);
  }

  submitFeedback() {
    if (this.state.feedback || this.state.positiveFeedback || this.state.negativeFeedback) {
      // First we search the feedback for restricted words
      if (this.props.features.bannedWords.test(this.state.feedback) ||
          this.props.features.bannedWords.test(this.state.positiveFeedback) ||
          this.props.features.bannedWords.test(this.state.negativeFeedback)) {
        // If restricted words then we show an error to the user
        this.setState({ errorMessage: 'One or more words in your feedback is restricted by your administrator. Please edit and resubmit.' });
      } else {
        // If no restricted words then we continue
        if (this.state.feedback) {
          this.props.submitFeedbackToServer(this.props.features.moderatorApproval, this.state.feedback, 'single feedback');
          this.setState({ feedback: '' });
        } if (this.state.positiveFeedback) {
          this.props.submitFeedbackToServer(this.props.features.moderatorApproval, this.state.positiveFeedback, 'positive feedback');
          this.setState({ positiveFeedback: '' });
        } if (this.state.negativeFeedback) {
          this.props.submitFeedbackToServer(this.props.features.moderatorApproval, this.state.negativeFeedback, 'negative feedback');
          this.setState({ negativeFeedback: '' });
        }

        // tracker.trackEvent('Submit', 'Submit Feedback', { label: this.props.features.domain });
        this.setState({ errorMessage: '' });
        this.props.navigation.navigate('Submitted');
      }
    } else {
      this.setState({ errorMessage: 'Feedback box cannot be blank. Sorry!' });
    }
  }

  closeInstructions() {
    this.props.closeInstructions('Write Feedback Scene');
  }

  addImage = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true });

    // If user selects an image
    if (!pickerResult.cancelled) {
      this.props.uploadImage(pickerResult.uri);
    }
  }

  maybeRenderImage = () => {
    const { imageURL } = this.props.feedback;

    // If there is no image, don't render anything
    if (!imageURL) {
      return null;
    }

    return (
      <View style={styles.imageContainer}>
        <View style={styles.imageFrame}>
          <View style={{ borderTopRightRadius: 3, borderTopLeftRadius: 3, overflow: 'hidden' }}>
            <Image
              source={{ uri: imageURL }}
              style={{ width: 200, height: 200 }}
            />
          </View>
        </View>
      </View>
    );
  }

  maybeRenderUploadingOverlay = () => {
    const { loadingImage } = this.props.feedback;
    if (loadingImage) {
      return (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }]}>
          <ActivityIndicator
            color="#fff"
            animating
            size="large"
          />
          <Text style={{ color: 'white' }}>Uploading photo...</Text>
        </View>
      );
    }
  }

  renderButtons() {
    if (this.props.feedback.loading) {
      return <Spinner size="large" style={{ justifyContent: 'flex-start', marginTop: 20 }} />;
    }

    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 5.5 }}>
          <Button onPress={this.submitFeedback} style={{ marginBottom: 10, flex: 3 }}>
            Submit Feedback
          </Button>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={this.addImage}
            style={styles.button}
          >
            <Icon name="add-a-photo" size={25} color={'black'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    const placeholderText = 'Enter your feedback here!';

    const instructionsScreen = (
      <View style={styles.instructionContainer}>
        <TouchableOpacity onPress={this.closeInstructions} style={styles.touchableOpacityStyle}>
          <Image style={styles.image} source={fullScreen} resizeMode="stretch" />
        </TouchableOpacity>
      </View>
    );

    const singleFeedbackBox = (
      <View>
        <TextInput
          multiline={Boolean(true)}
          onChangeText={feedback => this.setState({ feedback })}
          onContentSizeChange={(event) => {
            this.setState({ height: event.nativeEvent.contentSize.height });
          }}
          style={styles.feedback_input}
          placeholder={placeholderText}
          value={this.state.feedback}
        />
        {this.maybeRenderImage()}
        {/* Submit button / loading spinner */}
        {this.renderButtons()}
      </View>
    );

    const positiveFeedbackBox = (
      <View>
        <TextInput
          multiline={Boolean(true)}
          onChangeText={positiveFeedback => this.setState({ positiveFeedback })}
          onContentSizeChange={(event) => {
            this.setState({ height: event.nativeEvent.contentSize.height });
          }}
          style={[styles.feedback_input, styles.positive_feedback_input]}
          placeholder={'Positives: What is something that positively contributed to sales and conversion?'}
          value={this.state.positiveFeedback}
        />
        {/* Submit button / loading spinner */}
        {this.renderButtons()}

        <TextInput
          multiline={Boolean(true)}
          onChangeText={negativeFeedback => this.setState({ negativeFeedback })}
          onContentSizeChange={(event) => {
            this.setState({ height: event.nativeEvent.contentSize.height });
          }}
          style={[styles.feedback_input, styles.negative_feedback_input]}
          placeholder={'Negatives: What is something that negatively impacted sales and conversion?'}
          value={this.state.negativeFeedback}
        />
        {/* Submit button / loading spinner */}
        {this.renderButtons()}
      </View>
    );

    const WriteFeedbackScene = (
      <View style={[styles.container, styles.swiper]}>
        <MenuContext style={{ flex: 1 }} ref="MenuContext">
          <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
            <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
              {/* Error message (blank if no error) */}
              <Text style={styles.errorTextStyle}>
                {this.state.errorMessage}
              </Text>

              {/* Feedback input box */}
              {this.props.features.positiveFeedbackBox ? positiveFeedbackBox : singleFeedbackBox }
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </MenuContext>
        {this.maybeRenderUploadingOverlay()}
      </View>
    );

    // const screenToShow = (!this.props.user.instructionsViewed.includes('Write Feedback Scene')) ? instructionsScreen : WriteFeedbackScene;
    return WriteFeedbackScene;
  }
}

FeedbackSubmit.propTypes = {
  user: React.PropTypes.object,
  features: React.PropTypes.object,
  feedback: React.PropTypes.object,
  submitFeedbackToServer: React.PropTypes.func,
  closeInstructions: React.PropTypes.func,
  navigation: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { user, features, feedback } = state;
  return { user, features, feedback };
}

export default connect(mapStateToProps, {
  submitFeedbackToServer,
  closeInstructions,
  uploadImage,
})(FeedbackSubmit);
