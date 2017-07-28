// Import Libraries
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';

// Import componenets, functions, and styles
import styles from '../styles/components/SolutionCardStyles';
import SolutionsCardItem from './SolutionsCardItem';
import { Card, CardSection } from '../components/common';
import translate from '../translation';

class SolutionsCard extends Component {

  renderSolutionsList = () => {
    const { noSolutionsMessage, subheaderText } = styles;
    const { solutions } = this.props;
    const { feedback } = this.props.navigation.state.params;
    const { status } = feedback;
    const feedbackSolutions = solutions.list
      .filter(solution => solution.feedbackId === feedback.id);

    // If no solutions have been submitted
    if (!feedbackSolutions.length) {
      return (
        <View style={{flex:1, flexDirection:'row', margin:30}}>
          <Icon name="comments-o" type="font-awesome" size={50} style={{flex:1}} color={'grey'}/>
          <View style={{flex:2}}>
          <Text style={[noSolutionsMessage, {marginTop:10}]}>{translate(this.props.user.language).NO_COMMENTS}</Text>
          <Text style={[noSolutionsMessage, {fontSize:18, fontWeight:'bold'}]}>{translate(this.props.user.language).BE_FIRST_COMMENT}</Text>
          </View>
        </View>
      );
    }

    // List of solutions
    const formattedSolutions = feedbackSolutions
      .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
      .map(solution => (
        <SolutionsCardItem solution={solution} key={solution.id} />
      ));

    return (
      <Card>
        <CardSection>
          <Text style={subheaderText}>{translate(this.props.user.language).PROPOSED_SOLUTIONS}</Text>
            <View style={{ width: 25, height: 20, alignItems: 'flex-start' }}>
              <Icon name="question-answer" color="#bdbdbd" />
            </View>
        </CardSection>
        {formattedSolutions}
      </Card>
    );
  }

  render() {
    return (
      <View>
        {this.renderSolutionsList()}
      </View>
    );
  }
}

SolutionsCard.propTypes = {
  navigation: PropTypes.object,
  solutions: PropTypes.object,
  group: PropTypes.object,
};

function mapStateToProps(state) {
  const { solutions, group, user } = state;
  return { solutions, group, user };
}

export default connect(mapStateToProps)(SolutionsCard);
