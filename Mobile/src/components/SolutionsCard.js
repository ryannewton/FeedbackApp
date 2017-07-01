// Import Libraries
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Import componenets, functions, and styles
import styles from '../styles/components/SolutionCardStyles';
import SolutionsCardItem from './SolutionsCardItem';
import { Card, CardSection } from '../components/common';

class SolutionsCard extends Component {

  renderSolutionsList = () => {
    const { noSolutionsMessage, subheaderText } = styles;
    const { solutions } = this.props;
    const { feedback } = this.props.navigation.state.params;
    const feedbackSolutions = solutions.list
      .filter(solution => solution.feedbackId === feedback.id);

    // If no solutions have been submitted
    if (!feedbackSolutions.length) {
      return (
        <CardSection>
          <Text style={noSolutionsMessage}>{'No solutions (yet)\nBe the first!'}</Text>
        </CardSection>
      );
    }

    // List of solutions
    const formattedSolutions = feedbackSolutions
      .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
      .map(solution => (
        <SolutionsCardItem solution={solution} key={solution.id} />
      ));

    return (
      <View>
        <CardSection>
          <Text style={subheaderText}>Proposed solutions</Text>
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

SolutionsCard.propTypes = {
  navigation: PropTypes.object,
  solutions: PropTypes.object,
  group: PropTypes.object,
};

function mapStateToProps(state) {
  const { solutions, group } = state;
  return { solutions, group };
}

export default connect(mapStateToProps)(SolutionsCard);
