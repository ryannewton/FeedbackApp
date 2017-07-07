// Import Libraries
import React, { Component } from 'react';
import {
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Import componenets, functions, and styles
import styles from '../styles/scenes/FeedbackDetailsStyles';
import FeedbackCard from '../components/FeedbackCard';
import SolutionsCard from '../components/SolutionsCard';
import ResponseCard from '../components/ResponseCard';
import { Button, Spinner } from '../components/common';
import {
  solutionChanged,
  submitSolutionToServer,
  sendGoogleAnalytics,
} from '../actions';

class FeedbackDetails extends Component {
  constructor(props) {
    super(props);

    this.state = { errorMessage: '' };
    this.submitSolution = this.submitSolution.bind(this);
    props.sendGoogleAnalytics('FeedbackDetails', this.props.group.groupName, this.props.navigation.state.params.feedback.feedbackId);
  }

  submitSolution = () => {
    const { bannedWords, solutionsRequireApproval } = this.props.group;
    const { solution } = this.props.solutions;
    const { feedback } = this.props.navigation.state.params;

    if (bannedWords.test(solution.toLowerCase())) {
      // If restricted words then we show an error to the user
      this.setState({ errorMessage: 'One or more words in your feedback is restricted by your administrator. Please edit and resubmit.' });
    } else if (solution === '') {
      this.setState({ errorMessage: 'Sorry, solutions and comments cannot be blank.' });
    } else {
      this.setState({ errorMessage: '' });
      this.props.submitSolutionToServer(solution, feedback.id, solutionsRequireApproval);
      // tracker.trackEvent('Submit', 'Submit Solution', { label: groupName, value: feedback.id });
      Keyboard.dismiss();
    }
  }

  renderErrorMessage = () => {
    if (this.state.errorMessage !== '') {
      return (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: 'red', fontWeight: 'bold' }}>{this.state.errorMessage}</Text>
        </View>
      );
    }
    return null;
  }

  render() {
    const { container, inputText } = styles;
    const { feedback } = this.props.navigation.state.params;
    const { status } = feedback;
    const showSpinner = (
      <Spinner size="large" style={{ marginTop: 20 }} />
    );
    const showSubmitButton = (
      <Button onPress={this.submitSolution}>
       {(status && status === 'compliment')?'Submit Comment':'Submit Solution'}
      </Button>
    );

    return (
      <View style={container}>
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
          <ScrollView>
            <View>
              {/* Feedback description */}

              <FeedbackCard
                feedback={feedback}
                navigate={() => undefined}
                showImage
                showResponseTag={Boolean(false)}
              />

              {/* Offical Response card */}
              <ResponseCard navigation={this.props.navigation} feedback={feedback} />

              {/* List of submitted solutions */}
              <SolutionsCard navigation={this.props.navigation} />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>

        {this.renderErrorMessage()}

        {/* Input to submit a new solution */}
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-64}>
          <TextInput
            style={inputText}
            placeholder={((status && status === 'compliment')?"Enter your comment here...":"Enter your solution here...")}
            onChangeText={solution => this.props.solutionChanged(solution)}
            value={this.props.solutions.solution}
            returnKeyType={'done'}
            maxLength={200}
          />

          {/* Submit button */}
          {this.props.solutions.loading ? showSpinner : showSubmitButton}
        </KeyboardAvoidingView>
      </View>
    );
  }
}

FeedbackDetails.propTypes = {
  navigation: PropTypes.object,
  solutions: PropTypes.object,
  group: PropTypes.object,
  solutionChanged: PropTypes.func,
  submitSolutionToServer: PropTypes.func,
  sendGoogleAnalytics: PropTypes.func,
};

function mapStateToProps(state) {
  const { solutions, group } = state;
  return { solutions, group };
}

const AppScreen = connect(mapStateToProps, {
  solutionChanged,
  submitSolutionToServer,
  sendGoogleAnalytics,
})(FeedbackDetails);

export default AppScreen;
