// Import Libraries
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

// Import componenets, functions, and styles
import styles from '../styles/scenes/FeedbackDetailsStyles';
import SolutionsCardItem from './SolutionsCardItem';
import { Card, CardSection } from '../components/common';

// Import tracking
// import { tracker } from '../constants';

class FeedbackDetails extends Component {
  constructor(props) {
    super(props);

    // tracker.trackScreenViewWithCustomDimensionValues('Project Details', { domain: props.features.domain, project: String(props.navigation.state.params.project.id) });
  }
  renderSolutionsList() {
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

    // List of solutions
    const formattedSolutions = projectSolutions
      .sort((a, b) => (b.votes - b.downvotes) - (a.votes - a.downvotes))
      .map(solution => (
        <SolutionsCardItem solution={solution} key={solution.id} />
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

  render() {
    return (
      <Card>
        {this.renderSolutionsList()}
      </Card>
    );
  }
}

FeedbackDetails.propTypes = {
  navigation: React.PropTypes.object,
  solutions: React.PropTypes.object,
  features: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { solutions, features } = state;
  return { solutions, features };
}

export default connect(mapStateToProps)(FeedbackDetails);
