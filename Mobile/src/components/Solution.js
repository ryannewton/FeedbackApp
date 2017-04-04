// Import libraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';

// Import styles, components, and action creators
import styles from '../styles/components/SolutionStyles';
import { CardSection } from '../components/common';
import { addSolutionUpvote, removeSolutionUpvote } from '../actions';

class Solution extends Component {
  upvoteSolution(solution) {
    const { user } = this.props;
    // If user hasn't upvoted this project, add an upvote
    if (!user.solutionUpvotes.includes(solution.id)) {
      this.props.addSolutionUpvote(solution);
    } else {
      this.props.removeSolutionUpvote(solution);
    }
  }

  renderSolutionUpvoteButton(solution) {
    const { user } = this.props;
    let iconColor = 'grey';
    // If user hasn't upvoted this project
    if (user.solutionUpvotes.includes(solution.id)) {
      iconColor = '#b6001e';
    }

    return (
      <TouchableOpacity onPress={() => this.upvoteSolution(solution)}>
        <View>
          <Icon name="thumb-up" size={30} color={iconColor} />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { solution } = this.props;
    const { solutionText, upvoteCountText } = styles;

    return (
      <CardSection>
        <View style={{ justifyContent: 'flex-start', flex: 1 }}>
          {/* Solution description */}
          <Text style={solutionText}>{solution.title}</Text>

          {/* Upvote count and button */}
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
            <View style={{ flex: 7 }}>
              <Text style={upvoteCountText}>
                {`${solution.votes} Votes`}
              </Text>
            </View>
            <View style={{ flex: 2, alignItems: 'flex-end' }}>
              {this.renderSolutionUpvoteButton(solution)}
            </View>
          </View>
        </View>
      </CardSection>
    );
  }
}

Solution.propTypes = {
  solution: React.PropTypes.object,
  user: React.PropTypes.object,
  addSolutionUpvote: React.PropTypes.func,
  removeSolutionUpvote: React.PropTypes.func,
};

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}

export default connect(mapStateToProps, {
  addSolutionUpvote,
  removeSolutionUpvote,
})(Solution);
