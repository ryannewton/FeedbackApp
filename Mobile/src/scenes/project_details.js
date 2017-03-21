// Import Libraries
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { connect } from 'react-redux';

// Import componenets, functions, and styles
import styles from '../styles/scenes/project_details_styles';
import { Button, Card, CardSection, Spinner } from '../components/common';
import {
  addUpvote,
  removeUpvote,
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
    if (!user.upvotes.includes(project.id)) {
      this.props.addUpvote(project);
    } else {
      this.props.removeUpvote(project);
    }
  }

  upvoteSolution(solution) {
    const { user } = this.props;
    // If user hasn't upvoted this project, add an upvote
    if (!user.solutionUpvotes.includes(solution.id)) {
      this.props.addSolutionUpvote(solution);
    } else {
      this.props.removeSolutionUpvote(solution);
    }
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

    {/* To do: Make rendering a single solution a stand alone component */}
    const formattedSolutions = projectSolutions.map((solution, index) => (
      <CardSection key={index} >
        <View style={{ justifyContent: 'flex-start', flex: 1 }}>
          {/* Solution description */}
          <Text style={solutionText}>{solution.description}</Text>

          {/* Upvote count and button */}
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
            <View style={{ flex: 4 }}>
              <Text style={{ textDecorationLine: 'underline' }}>
                {`${solution.votes} Votes`}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              {this.renderSolutionUpvoteButton(solution)}
            </View>
          </View>
        </View>
      </CardSection>
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
    if (user.upvotes.includes(project.id)) {
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

  renderSolutionUpvoteButton(solution) {
    const { user } = this.props;
    let buttonStyles = { width: 60, height: 23, marginRight: 2 };
    let textStyles = { fontSize: 13 };
    // If user hasn't upvoted this project
    if (user.solutionUpvotes.includes(solution.id)) {
      buttonStyles = { ...buttonStyles, backgroundColor: '#007aff' };
      textStyles = { ...textStyles, color: '#fff' };
    }
    return (
      <Button
        onPress={() => this.upvoteSolution(solution)}
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
    );
  }
}

ProjectDetails.propTypes = {
  navigation: React.PropTypes.object,
  user: React.PropTypes.object,
  solutions: React.PropTypes.object,
  main: React.PropTypes.object,
  addUpvote: React.PropTypes.func,
  removeUpvote: React.PropTypes.func,
  addSolutionUpvote: React.PropTypes.func,
  removeSolutionUpvote: React.PropTypes.func,
  solutionChanged: React.PropTypes.func,
  submitSolutionToServer: React.PropTypes.func,
};

function mapStateToProps(state) {
  const { user, solutions, main } = state;
  return { user, solutions, main };
}

const AppScreen = connect(mapStateToProps, {
  addUpvote,
  removeUpvote,
  addSolutionUpvote,
  removeSolutionUpvote,
  solutionChanged,
  submitSolutionToServer,
})(ProjectDetails);

AppScreen.navigationOptions = {
  title: 'Project Details',
};

export default AppScreen;
