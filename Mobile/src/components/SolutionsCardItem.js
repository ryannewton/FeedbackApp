// Import libraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';

// Import styles, components, and action creators
import styles from '../styles/components/SolutionStyles';
import { CardSection } from '../components/common';
import { addSolutionUpvote, removeSolutionUpvote, addSolutionDownvote, removeSolutionDownvote } from '../actions';

// Import tracking
// import { tracker } from '../constants';

class SolutionsCardItem extends Component {
  upvoteSolution(solution) {
    const { user } = this.props;
    // If user hasn't upvoted this project, add an upvote
    if (!user.solutionUpvotes.includes(solution.id)) {
      // tracker.trackEvent('Solution Vote', 'Solution UpVote Via Solution Button', { label: this.props.features.domain });
      this.props.addSolutionUpvote(solution);
    } else {
      // tracker.trackEvent('Remove Solution Vote', 'Remove Solution UpVote Via Solution Button', { label: this.props.features.domain });
      this.props.removeSolutionUpvote(solution);
    }
  }
  downvoteSolution(solution) {
    const { user } = this.props;
    // If user hasn't downvoted this project, add an downvote
    if (!user.solutionUpvotes.includes(solution.id)) {
      // tracker.trackEvent('Solution DownVote', 'Solution DownVote Via Solution Button', { label: this.props.features.domain });
      this.props.addSolutionDownvote(solution);
    } else {
      // tracker.trackEvent('Remove Solution Vote', 'Remove Solution DownVote Via Solution Button', { label: this.props.features.domain });
      this.props.removeSolutionDownvote(solution);
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
  renderSolutionDownvoteButton(solution) {
    const { user } = this.props;
    let iconColor = 'grey';
    // If user hasn't downvoted this project
    if (user.solutionUpvotes.includes(solution.id)) {
      iconColor = '#b6001e';
    }
    return (
      <TouchableOpacity onPress={() => this.downvoteSolution(solution)}>
        <View>
          <Icon name="thumb-down" size={30} color={iconColor} />
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
            <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
              {this.renderSolutionUpvoteButton(solution)}
            </View>
          </View>
        </View>
      </CardSection>
    );
  }
}

SolutionsCardItem.propTypes = {
  solution: React.PropTypes.object,
  user: React.PropTypes.object,
  addSolutionUpvote: React.PropTypes.func,
  removeSolutionUpvote: React.PropTypes.func,
  addSolutionDownvote: React.PropTypes.func,
  removeSolutionDownvote: React.PropTypes.func,
  features: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { user, features } = state;
  return { user, features };
}

export default connect(mapStateToProps, {
  addSolutionUpvote,
  removeSolutionUpvote,
  addSolutionDownvote,
  removeSolutionDownvote,
})(SolutionsCardItem);
