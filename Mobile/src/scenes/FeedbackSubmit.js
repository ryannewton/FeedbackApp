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
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';

// Import actions
import { submitFeedbackToServer, uploadImage, sendGoogleAnalytics } from '../actions';

// Import components, functions, and styles
import { Button, Spinner } from '../components/common';
import styles from '../styles/scenes/FeedbackSubmitStyles';

class FeedbackSubmit extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      errorMessage: '',
      feedback: '',
      positiveFeedback: '',
      negativeFeedback: '',
    };

    props.sendGoogleAnalytics('FeedbackSubmit')
  }

  submitFeedback = () => {
    if (this.state.feedback || this.state.positiveFeedback || this.state.negativeFeedback) {
      // First we search the feedback for restricted words
      if (this.props.group.bannedWords.test(this.state.feedback.toLowerCase()) ||
          this.props.group.bannedWords.test(this.state.positiveFeedback.toLowerCase()) ||
          this.props.group.bannedWords.test(this.state.negativeFeedback.toLowerCase())) {
        // If restricted words then we show an error to the user
        this.setState({ errorMessage: 'One or more words in your feedback is restricted by your administrator. Please edit and resubmit.' });
      } else {
        // If no restricted words then we continue
        if (this.state.feedback) {
          this.props.submitFeedbackToServer(this.props.group.feedbackRequireApproval, this.state.feedback, 'single feedback', this.props.feedback.imageURL || '');
          this.setState({ feedback: '' });
        } if (this.state.positiveFeedback) {
          this.props.submitFeedbackToServer(this.props.group.feedbackRequireApproval, this.state.positiveFeedback, 'positive feedback', this.props.feedback.positiveImageURL || '');
          this.setState({ positiveFeedback: '' });
        } if (this.state.negativeFeedback) {
          this.props.submitFeedbackToServer(this.props.group.feedbackRequireApproval, this.state.negativeFeedback, 'negative feedback', this.props.feedback.negativeImageURL || '');
          this.setState({ negativeFeedback: '' });
        }

        this.setState({ errorMessage: '' });
        this.props.navigation.navigate('Submitted');
      }
    } else {
      this.setState({ errorMessage: 'Feedback box cannot be blank. Sorry!' });
    }
  }

  addImage = async (type) => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({ allowsEditing: false });

    // If user selects an image
    if (!pickerResult.cancelled) {
      this.props.uploadImage(pickerResult.uri, type);
    }
  }

  maybeRenderImage = (type) => {
    const { width, height } = Dimensions.get('window')
    let imageURL;
    let sizeConstraint;
    if (!type) {
      imageURL = this.props.feedback.imageURL;
      sizeConstraint = this.state.sizeConstraint;
    }
    else if (type === 'positive') {
      imageURL = this.props.feedback.positiveImageURL;
      sizeConstraint = this.state.positiveSizeConstraint;
    }
    else if (type === 'negative') {
      imageURL = this.props.feedback.negativeImageURL;
      sizeConstraint = this.state.negativeSizeConstraint;
    }

    // If there is no image, don't render anything
    if (!imageURL) {
      return <View />;
    }

    Image.getSize(imageURL, (iwidth, iheight) => {
      let sizeConstraint = {};
      if (iwidth > iheight) {
        sizeConstraint = { width: width*0.45, height: iheight/iwidth*width*0.45 }
      } else {
        sizeConstraint = { height: width*0.6, width: iwidth/iheight*width*0.6 }
      }
      if (!type) {
        this.setState({ sizeConstraint });
      }
      else if (type === 'positive') {
        this.setState({ positiveSizeConstraint: sizeConstraint });
      }
      else if (type === 'negative') {
        this.setState({ negativeSizeConstraint: sizeConstraint });
      }
    });

    if (sizeConstraint) {
      return (
        <Image
          source={{ uri: imageURL }}
          style={[
            sizeConstraint, {
            shadowColor: 'rgba(0,0,0,1)',
            shadowOpacity: 0.5,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            marginTop: 10,
            alignSelf: 'center'
          }]}
        />
      );
    }
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

  renderButtons = (type) => {
    if (this.props.feedback.loading) {
      return <Spinner size="large" style={{ justifyContent: 'flex-start', marginTop: 20 }} />;
    }

    return (
      <View style={{ flexDirection: 'row', paddingTop:10 }}>
        <View style={{ flex: 3.5 }}>
          <Button onPress={this.submitFeedback}>
            Submit Feedback
          </Button>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => this.addImage(type)}
            style={styles.button}
          >
            <Icon name="add-a-photo" size={25} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    const placeholderText = 'Enter your feedback here!';

    const singleFeedbackBox = (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row'}}>
          <TextInput
            multiline={Boolean(true)}
            onChangeText={feedback => this.setState({ feedback })}
            style={[styles.feedbackInput, { flex: 1 }]}
            placeholder={placeholderText}
            placeholderTextColor="#d0d0d0"f
            value={this.state.feedback}
            maxLength={500}
          />
        </View>
        {this.renderButtons()}
        {this.maybeRenderImage()}
      </View>
    );

    const positiveFeedbackBox = (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
          <View style={{ flexDirection: 'row'}}>
            <TextInput
              multiline={Boolean(true)}
              onChangeText={positiveFeedback => this.setState({ positiveFeedback })}
              style={[styles.feedbackInput, styles.positiveFeedbackInput, { flex: 1 }]}
              placeholder={'Positives: What is something that positively contributed to sales and conversion?'}
              placeholderTextColor="#d0d0d0"
              value={this.state.positiveFeedback}
              maxLength={500}
            />
          </View>
          {/* Submit button / loading spinner */}
          {this.renderButtons('positive')}
          {this.maybeRenderImage('positive')}
        </View>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
          <View style={{ flexDirection: 'row'}}>
            <TextInput
              multiline={Boolean(true)}
              onChangeText={negativeFeedback => this.setState({ negativeFeedback })}
              onContentSizeChange={(event) => {
                this.setState({ height: event.nativeEvent.contentSize.height });
              }}
              style={[styles.feedbackInput, styles.negativeFeedbackInput, { flex: 1 }]}
              placeholder={'Negatives: What is something that negatively impacted sales and conversion?'}
              placeholderTextColor="#d0d0d0"
              value={this.state.negativeFeedback}
              maxLength={500}
            />
          </View>
          {/* Submit button / loading spinner */}
          {this.renderButtons('negative')}
          {this.maybeRenderImage('negative')}
        </View>
      </View>
    );

    return (
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Text style={styles.errorTextStyle}>
            {this.state.errorMessage}
          </Text>
          {this.props.group.includePositiveFeedbackBox ? positiveFeedbackBox : singleFeedbackBox}
          {this.maybeRenderUploadingOverlay()}
        </View>          
      </TouchableWithoutFeedback>
    );
  }
}

FeedbackSubmit.propTypes = {
  user: PropTypes.object,
  group: PropTypes.object,
  feedback: PropTypes.object,
  submitFeedbackToServer: PropTypes.func,
  navigation: PropTypes.object,
};

function mapStateToProps(state) {
  const { user, group, feedback } = state;
  return { user, group, feedback };
}

export default connect(mapStateToProps, {
  submitFeedbackToServer,
  uploadImage,
  sendGoogleAnalytics
})(FeedbackSubmit);
