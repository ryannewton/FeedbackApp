// Import Libraries
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

// Import componenets, functions, and styles
import styles from '../styles/scenes/SuggestionDetailsStyles';
import SolutionsCardItem from './SolutionsCardItem';
import { Card, CardSection } from '../components/common';

// Import tracking
// import { tracker } from '../constants';

class SolutionsCard extends Component {
  // constructor(props) {
  //   super(props);
  //   tracker.trackScreenViewWithCustomDimensionValues('Suggestion Details', { domain: props.group.domain, suggestion: String(props.navigation.state.params.suggestion.id) });
  // }
  
  renderSolutionsList() {
    const { noSolutionsMessage, subheaderText } = styles;
    const { solutions } = this.props;
    const { suggestion } = this.props.navigation.state.params;
    const suggestionSolutions = solutions.list.filter(solution => solution.suggestionId === suggestion.id);

    // If no solutions have been submitted
    if (suggestionSolutions.length === 0) {
      return (
        <CardSection>
          <Text style={noSolutionsMessage}>{'No solutions (yet)\nBe the first!'}</Text>
        </CardSection>
      );
    }

    // List of solutions
    const formattedSolutions = suggestionSolutions
      .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
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

SolutionsCard.propTypes = {
  navigation: React.PropTypes.object,
  solutions: React.PropTypes.object,
  group: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { solutions, group } = state;
  return { solutions, group };
}

export default connect(mapStateToProps)(SolutionsCard);
