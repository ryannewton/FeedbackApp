// Import Libraries
import React, { Component } from 'react';
import { View, TextInput, Keyboard, TouchableWithoutFeedback, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { MenuContext } from 'react-native-menu';
import { NavigationActions } from 'react-navigation';

// Import actions
import { feedbackChanged, submitFeedbackToServer, closeInstructions } from '../actions';

// Import components, functions, and styles
import { Button, Spinner } from '../components/common';
import styles from '../styles/styles_main';

// Import about info image
// import styles2 from '../styles/scenes/SplashScreenStyles';
import fullScreen from '../../images/backgrounds/FeedbackInfo.png';

var styles2 = StyleSheet.create({
  imageContainer: {
    flex: 1,
    alignItems: 'stretch'
  },
  image: {
    flex: 1
  }
});

class Feedback extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      height: 0,
    };

    this.navigateTo = this.navigateTo.bind(this);
    this.closeInstructions = this.closeInstructions.bind(this);
  }

  navigateTo(routeName, subRouteName) {
    const navigateAction = NavigationActions.navigate({
      routeName,
      params: {},
      action: NavigationActions.navigate({ routeName: subRouteName }),
    });
    this.props.navigation.dispatch(navigateAction);
  }

  submitFeedback() {
    this.props.submitFeedbackToServer();
    this.navigateTo('Tabs', 'Submitted');
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
    const placeholderText = 'Enter your feedback here. We will work on addressing it with the appropriate administrator!';

    const instructionsScreen = (
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={this.closeInstructions} style={{ flex: 1 }}>
          <Image style={styles2.background} source={fullScreen} resizeMode="cover" />
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

    //const screenToShow = (!this.props.user.instructionsViewed.includes('Write Feedback Scene')) ? instructionsScreen : WriteFeedbackScene;
    const screenToShow = WriteFeedbackScene;

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
  return { user, feedback, loading };
}

export default connect(mapStateToProps, {
  feedbackChanged,
  submitFeedbackToServer,
  closeInstructions,
})(Feedback);
