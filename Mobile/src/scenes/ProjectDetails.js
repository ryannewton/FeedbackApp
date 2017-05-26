// Import Libraries
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';

// Import componenets, functions, and styles
import styles from '../styles/scenes/ProjectDetailsStyles';
import Project from '../components/Project';
import Solution from '../components/Solution';
import { Button, Card, CardSection, Spinner } from '../components/common';
import {
  solutionChanged,
  submitSolutionToServer,
} from '../actions';

// Import tracking
import { tracker } from '../constants';

class ProjectDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: '',
    };

    tracker.trackScreenViewWithCustomDimensionValues('Project Details', { domain: props.features.domain, project: String(props.navigation.state.params.project.id) });

    this.submitSolution = this.submitSolution.bind(this);
  }
  solutionsList() {
    const { noSolutionsMessage, subheaderText } = styles;
    const { solutions } = this.props;
    const { project } = this.props.navigation.state.params;
    const projectSolutions = solutions.list.filter(solution => solution.project_id === project.id);

    // If no solutions have been submitted
    if (projectSolutions.length === 0) {
      return (
        <CardSection>
          <Text style={noSolutionsMessage}>{'No solutions (yet)\nBe the first!'}</Text>
        </CardSection>
      );
    }

    const formattedSolutions = projectSolutions
      .sort((a, b) => b.votes - a.votes)
      .map(solution => (
        <Solution solution={solution} key={solution.id} />
      ));

    return (
      <View>
        <CardSection>
          <Text style={subheaderText}>Suggested solutions</Text>
        </CardSection>
        {formattedSolutions}
      </View>
    );
  }

  submitSolution() {
    if (this.props.features.bannedWords.test(this.props.solutions.solution)) {
      // If restricted words then we show an error to the user
      this.setState({ errorMessage: 'One or more words in your feedback is restricted by your administrator. Please edit and resubmit.' });
    } else {
      this.setState({ errorMessage: '' });
      const { solution } = this.props.solutions;
      const { project } = this.props.navigation.state.params;
      this.props.submitSolutionToServer(solution, project.id, this.props.features.moderatorApprovalSolutions);
      tracker.trackEvent('Submit', 'Submit Solution', { label: this.props.features.domain, value: project.id });
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
              <Project project={project} navigate={() => undefined} />

              {/* List of submitted solutions */}
              <Card>
                {this.solutionsList()}
              </Card>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
        {/* Input to submit a new solution */}
        
        {/* Error message (blank if no error) */}
        <Text style={styles.errorTextStyle}>
          {this.state.errorMessage || this.props.solutions.message}
        </Text>

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

ProjectDetails.propTypes = {
  navigation: React.PropTypes.object,
  user: React.PropTypes.object,
  solutions: React.PropTypes.object,
  features: React.PropTypes.object,
  solutionChanged: React.PropTypes.func,
  submitSolutionToServer: React.PropTypes.func,
};

function mapStateToProps(state) {
  const { user, solutions, features } = state;
  return { user, solutions, features };
}

const AppScreen = connect(mapStateToProps, {
  solutionChanged,
  submitSolutionToServer,
})(ProjectDetails);

export default AppScreen;
