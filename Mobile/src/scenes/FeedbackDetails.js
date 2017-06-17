// Import Libraries
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';

// Import componenets, functions, and styles
import styles from '../styles/scenes/FeedbackDetailsStyles';
import FeedbackCard from '../components/FeedbackCard';
import SolutionsCard from '../components/SolutionsCard';
import ResponseCard from '../components/ResponseCard';
import { Button, Spinner } from '../components/common';
import {
  solutionChanged,
  submitSolutionToServer,
} from '../actions';

// Import tracking
// import { tracker } from '../constants';

class FeedbackDetails extends Component {
  constructor(props) {
    super(props);

    this.state = { errorMessage: '' };
    // tracker.trackScreenViewWithCustomDimensionValues('Project Details', { domain: props.features.domain, project: String(props.navigation.state.params.project.id) });
    this.submitSolution = this.submitSolution.bind(this);
  }

  submitSolution() {
    const { domain, bannedWords, moderatorApprovalSolutions } = this.props.features;
    const { solution } = this.props.solutions;
    const { project } = this.props.navigation.state.params;

    if (bannedWords.test(solution)) {
      // If restricted words then we show an error to the user
      this.setState({ errorMessage: 'One or more words in your feedback is restricted by your administrator. Please edit and resubmit.' });
    } else {
      this.setState({ errorMessage: '' });
      this.props.submitSolutionToServer(solution, project.id, moderatorApprovalSolutions);
      // tracker.trackEvent('Submit', 'Submit Solution', { label: domain, value: project.id });
      Keyboard.dismiss();
    }
  }

  renderSubmitButton() {
    // If waiting for response from server, show a spinner
    if (this.props.solutions.loading) {
      return <Spinner size="large" style={{ justifyContent: 'flex-start', marginTop: 20 }} />;
    }

    return (
      <Button onPress={this.submitSolution}>
        Submit Suggestion
      </Button>
    );
  }

  render() {
    const { container, inputText } = styles;
    const { project } = this.props.navigation.state.params;

    return (
      <View style={container}>
        <ScrollView>
          <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
            <View>
              {/* Project description */}
              <FeedbackCard project={project} navigate={() => undefined } renderStatus renderImage />

              {/* Official response */}
              <ResponseCard navigation={this.props.navigation} />

              {/* List of submitted solutions */}
              <SolutionsCard navigation={this.props.navigation} />
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>

        {/* Error message (blank if no error) */}
        {/* <Text style={styles.errorTextStyle}>
          {this.state.errorMessage || this.props.solutions.message}
        </Text>*/}

        {/* Input to submit a new solution */}
        <KeyboardAvoidingView behavior={'padding'}>
          <TextInput
            style={inputText}
            placeholder="Enter your idea here!"
            onChangeText={solution => this.props.solutionChanged(solution)}
            value={this.props.solutions.solution}
            returnKeyType={'done'}
          />
          {/* Submit button */}
          {this.renderSubmitButton()}
        </KeyboardAvoidingView>
      </View>
    );
  }
}

FeedbackDetails.propTypes = {
  navigation: React.PropTypes.object,
  solutions: React.PropTypes.object,
  features: React.PropTypes.object,
  solutionChanged: React.PropTypes.func,
  submitSolutionToServer: React.PropTypes.func,
};

function mapStateToProps(state) {
  const { solutions, features } = state;
  return { solutions, features };
}

const AppScreen = connect(mapStateToProps, {
  solutionChanged,
  submitSolutionToServer,
})(FeedbackDetails);

export default AppScreen;
