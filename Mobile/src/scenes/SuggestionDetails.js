// Import Libraries
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';

// Import componenets, functions, and styles
import styles from '../styles/scenes/SuggestionDetailsStyles';
import SuggestionCard from '../components/SuggestionCard';
import SolutionsCard from '../components/SolutionsCard';
import { Button, Spinner } from '../components/common';
import {
  solutionChanged,
  submitSolutionToServer,
} from '../actions';

// Import tracking
// import { tracker } from '../constants';

class SuggestionDetails extends Component {
  constructor(props) {
    super(props);

    this.state = { errorMessage: '' };
    // tracker.trackScreenViewWithCustomDimensionValues('Suggestion Details', { groupName: props.group.groupName, suggestion: String(props.navigation.state.params.suggestion.id) });
    this.submitSolution = this.submitSolution.bind(this);
  }

  submitSolution() {
    const { groupName, bannedWords, solutionsRequireApproval } = this.props.group;
    const { solution } = this.props.solutions;
    const { suggestion } = this.props.navigation.state.params;

    if (bannedWords.test(solution)) {
      // If restricted words then we show an error to the user
      this.setState({ errorMessage: 'One or more words in your feedback is restricted by your administrator. Please edit and resubmit.' });
    } else {
      this.setState({ errorMessage: '' });
      this.props.submitSolutionToServer(solution, suggestion.id, solutionsRequireApproval);
      // tracker.trackEvent('Submit', 'Submit Solution', { label: groupName, value: suggestion.id });
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
    const { suggestion } = this.props.navigation.state.params;

    return (
      <View style={container}>
        <ScrollView>
          <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
            <View>
              {/* Suggestion description */}
              <SuggestionCard suggestion={suggestion} navigate={() => undefined} />

              {/* List of submitted solutions */}
              <SolutionsCard navigation={this.props.navigation} />
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>

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

SuggestionDetails.propTypes = {
  navigation: React.PropTypes.object,
  solutions: React.PropTypes.object,
  group: React.PropTypes.object,
  solutionChanged: React.PropTypes.func,
  submitSolutionToServer: React.PropTypes.func,
};

function mapStateToProps(state) {
  const { solutions, group } = state;
  return { solutions, group };
}

const AppScreen = connect(mapStateToProps, {
  solutionChanged,
  submitSolutionToServer,
})(SuggestionDetails);

export default AppScreen;
