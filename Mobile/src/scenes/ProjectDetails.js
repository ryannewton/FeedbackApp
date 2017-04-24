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
  addProjectUpvote,
  removeProjectUpvote,
  addSolutionUpvote,
  removeSolutionUpvote,
  solutionChanged,
  submitSolutionToServer,
} from '../actions';

class ProjectDetails extends Component {
  constructor(props) {
    super(props);

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
      .map((solution, index) => (
        <Solution solution={solution} key={index} />
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
    const { solution } = this.props.main;
    const { project } = this.props.navigation.state.params;
    this.props.submitSolutionToServer(solution, project.id);
    Keyboard.dismiss();
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
        <KeyboardAvoidingView behavior={'padding'}>
          <TextInput
            style={inputText}
            placeholder="Enter your idea here!"
            onChangeText={solution => this.props.solutionChanged(solution)}
            value={this.props.main.solution}
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
  main: React.PropTypes.object,
  addProjectUpvote: React.PropTypes.func,
  removeProjectUpvote: React.PropTypes.func,
  addSolutionProjectUpvote: React.PropTypes.func,
  removeSolutionProjectUpvote: React.PropTypes.func,
  solutionChanged: React.PropTypes.func,
  submitSolutionToServer: React.PropTypes.func,
};

function mapStateToProps(state) {
  const { user, solutions, main } = state;
  return { user, solutions, main };
}

const AppScreen = connect(mapStateToProps, {
  addProjectUpvote,
  removeProjectUpvote,
  addSolutionUpvote,
  removeSolutionUpvote,
  solutionChanged,
  submitSolutionToServer,
})(ProjectDetails);

export default AppScreen;
