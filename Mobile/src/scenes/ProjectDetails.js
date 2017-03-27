// Import Libraries
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { connect } from 'react-redux';

// Import componenets, functions, and styles
import styles from '../styles/scenes/project_details_styles';
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
  upvoteProject() {
    const { user } = this.props;
    const { project } = this.props.navigation.state.params;
    // If user hasn't upvoted this project, add an upvote
    if (!user.projectUpvotes.includes(project.id)) {
      this.props.addProjectUpvote(project);
    } else {
      this.props.removeProjectUpvote(project);
    }
  }

  compareNumbers(a, b) {
    return b.votes - a.votes;
  }

  projectDescription() {
    const { buttonText, lowWeight } = styles;
    const { project } = this.props.navigation.state.params;

    return (
      <View style={{ flex: 1, justifyContent: 'flex-start' }}>
        {/* Project title */}
        <Text style={buttonText}>
          {project.title}
        </Text>

        {/* Vote section */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
          {/* Vote count */}
          <View style={{ flex: 3 }}>
            <Text style={[buttonText, lowWeight]}>
              {`${project.votes} Votes`}
            </Text>
          </View>

          {/* Upvote button */}
          <View style={{ flex: 1 }}>
            {this.renderUpvoteButton()}
          </View>
        </View>
      </View>
    );
  }

  solutionsList() {
    const { solutionText, subheaderText } = styles;
    const { solutions } = this.props;
    const { project } = this.props.navigation.state.params;
    const projectSolutions = solutions.list.filter(solution => solution.project_id === project.id);

    // If no solutions have been submitted
    if (projectSolutions.length === 0) {
      return (
        <CardSection>
          <Text style={solutionText}>No solutions submitted yet. Be the first!</Text>
        </CardSection>
      );
    }

    const formattedSolutions = projectSolutions.sort(this.compareNumbers).map((solution, index) => (
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

  renderUpvoteButton() {
    const { user } = this.props;
    const { project } = this.props.navigation.state.params;
    let buttonStyles = { width: 80, height: 27, marginRight: 2 };
    let textStyles = {};
    // If user hasn't upvoted this project
    if (user.projectUpvotes.includes(project.id)) {
      buttonStyles = { ...buttonStyles, backgroundColor: '#007aff' };
      textStyles = { ...textStyles, color: '#fff' };
    }
    return (
      <Button
        onPress={this.upvoteProject.bind(this)}
        style={buttonStyles}
        textStyle={textStyles}
      >
        Upvote!
      </Button>
    );
  }

  renderSubmitButton() {
    // If waiting for response from server, show a spinner
    if (this.props.solutions.loading) {
      return <Spinner size="large" style={{ justifyContent: 'flex-start', marginTop: 20 }} />;
    }

    const { solution } = this.props.main;
    const { project } = this.props.navigation.state.params;

    return (
      <Button onPress={() => this.props.submitSolutionToServer(solution, project.id)}>
        Submit Suggestion
      </Button>
    );
  }

  render() {
    const { container, inputText } = styles;
    return (
      <ScrollView>
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
          <View style={container}>

            {/* Project description */}
            <Card>
              <CardSection>
                {this.projectDescription()}
              </CardSection>
            </Card>

            {/* List of submitted solutions */}
            <Card>
              {this.solutionsList()}
            </Card>

            {/* Input to submit a new solution */}
            <TextInput
              multiline={Boolean(true)}
              style={inputText}
              placeholder="Submit a suggestion"
              onChangeText={solution => this.props.solutionChanged(solution)}
              value={this.props.main.solution}
            />

            {/* Success/fail message for submitted solution */}
            <View>
              <Text>{this.props.solutions.message}</Text>
            </View>

            {/* Submit button */}
            {this.renderSubmitButton()}

          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
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

AppScreen.navigationOptions = {
  title: 'Project Details',
};

export default AppScreen;
