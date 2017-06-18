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
import { submitSuggestionToServer, closeInstructions, uploadImage } from '../actions';

// Import components, functions, and styles
import { Button, Spinner } from '../components/common';

// Import about info image
import styles from '../styles/scenes/SuggestionSubmitStyles';
import fullScreen from '../../images/backgrounds/SuggestionInfo.jpg';

// Import tracking
// import { tracker } from '../constants';

class SuggestionSubmit extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      height: 0,
      errorMessage: '',
      suggestion: '',
      positiveSuggestion: '',
      negativeSuggestion: '',
    };

    // tracker.trackScreenViewWithCustomDimensionValues('Suggestion', { domain: props.group.domain });

    this.closeInstructions = this.closeInstructions.bind(this);
    this.submitSuggestion = this.submitSuggestion.bind(this);
  }

  submitSuggestion() {
    if (this.state.suggestion || this.state.positiveSuggestion || this.state.negativeSuggestion) {
      // First we search the suggestion for restricted words
      if (this.props.group.bannedWords.test(this.state.suggestion) ||
          this.props.group.bannedWords.test(this.state.positiveSuggestion) ||
          this.props.group.bannedWords.test(this.state.negativeSuggestion)) {
        // If restricted words then we show an error to the user
        this.setState({ errorMessage: 'One or more words in your suggestion is restricted by your administrator. Please edit and resubmit.' });
      } else {
        // If no restricted words then we continue
        if (this.state.suggestion) {
          this.props.submitSuggestionToServer(this.props.group.suggestionsRequireApproval, this.state.suggestion, 'single suggestion', this.props.suggestions.imageURL);
          this.setState({ suggestion: '' });
        } if (this.state.positiveSuggestion) {
          this.props.submitSuggestionToServer(this.props.group.suggestionsRequireApproval, this.state.positiveSuggestion, 'positive suggestion', this.props.suggestions.imageURL);
          this.setState({ positiveSuggestion: '' });
        } if (this.state.negativeSuggestion) {
          this.props.submitSuggestionToServer(this.props.group.suggestionsRequireApproval, this.state.negativeSuggestion, 'negative suggestion', this.props.suggestions.imageURL);
          this.setState({ negativeSuggestion: '' });
        }

        // tracker.trackEvent('Submit', 'Submit Suggestion', { label: this.props.group.domain });
        this.setState({ errorMessage: '' });
        this.props.navigation.navigate('Submitted');
      }
    } else {
      this.setState({ errorMessage: 'Suggestion box cannot be blank. Sorry!' });
    }
  }

  closeInstructions() {
    this.props.closeInstructions('Write Suggestion Scene');
  }

  addImage = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true });

    // If user selects an image
    if (!pickerResult.cancelled) {
      this.props.uploadImage(pickerResult.uri);
    }
  }

  maybeRenderImage = () => {
    const { imageURL } = this.props.suggestions;

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
    const { loadingImage } = this.props.suggestions;
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
    if (this.props.suggestions.loading) {
      return <Spinner size="large" style={{ justifyContent: 'flex-start', marginTop: 20 }} />;
    }

    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 5.5 }}>
          <Button onPress={this.submitSuggestion} style={{ marginBottom: 10, flex: 3 }}>
            Submit Suggestion
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
    const placeholderText = 'Enter your suggestion here!';

    const instructionsScreen = (
      <View style={styles.instructionContainer}>
        <TouchableOpacity onPress={this.closeInstructions} style={styles.touchableOpacityStyle}>
          <Image style={styles.image} source={fullScreen} resizeMode="stretch" />
        </TouchableOpacity>
      </View>
    );

    const singleSuggestionBox = (
      <View>
        <TextInput
          multiline={Boolean(true)}
          onChangeText={suggestion => this.setState({ suggestion })}
          onContentSizeChange={(event) => {
            this.setState({ height: event.nativeEvent.contentSize.height });
          }}
          style={styles.suggestionInput}
          placeholder={placeholderText}
          value={this.state.suggestion}
        />
        {this.maybeRenderImage()}
        {/* Submit button / loading spinner */}
        {this.renderButtons()}
      </View>
    );

    const positiveSuggestionBox = (
      <View>
        <TextInput
          multiline={Boolean(true)}
          onChangeText={positiveSuggestion => this.setState({ positiveSuggestion })}
          onContentSizeChange={(event) => {
            this.setState({ height: event.nativeEvent.contentSize.height });
          }}
          style={[styles.suggestionInput, styles.positiveSuggestionInput]}
          placeholder={'Positives: What is something that positively contributed to sales and conversion?'}
          value={this.state.positiveSuggestion}
        />
        {/* Submit button / loading spinner */}
        {this.renderButtons()}

        <TextInput
          multiline={Boolean(true)}
          onChangeText={negativeSuggestion => this.setState({ negativeSuggestion })}
          onContentSizeChange={(event) => {
            this.setState({ height: event.nativeEvent.contentSize.height });
          }}
          style={[styles.suggestionInput, styles.negativeSuggestionInput]}
          placeholder={'Negatives: What is something that negatively impacted sales and conversion?'}
          value={this.state.negativeSuggestion}
        />
        {/* Submit button / loading spinner */}
        {this.renderButtons()}
      </View>
    );

    const WriteSuggestionScene = (
      <View style={[styles.container, styles.swiper]}>
        <MenuContext style={{ flex: 1 }} ref="MenuContext">
          <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
            <KeyboardAvoidingView behavior={'padding'} style={styles.container}>

              <Text style={styles.errorTextStyle}>
                {this.state.errorMessage}
              </Text>

              {this.props.group.includePositiveFeedbackBox ? positiveSuggestionBox : singleSuggestionBox}
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </MenuContext>
        {this.maybeRenderUploadingOverlay()}
      </View>
    );

    // const screenToShow = (!this.props.user.instructionsViewed.includes('Write Suggestion Scene')) ? instructionsScreen : WriteSuggestionScene;
    return WriteSuggestionScene;
  }
}

SuggestionSubmit.propTypes = {
  user: React.PropTypes.object,
  group: React.PropTypes.object,
  suggestion: React.PropTypes.object,
  submitSuggestionToServer: React.PropTypes.func,
  closeInstructions: React.PropTypes.func,
  navigation: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { user, group, suggestions } = state;
  return { user, group, suggestions };
}

export default connect(mapStateToProps, {
  submitSuggestionToServer,
  closeInstructions,
  uploadImage,
})(SuggestionSubmit);
