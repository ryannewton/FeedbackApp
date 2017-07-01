// Import libraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';

// Import styles, components, and action creators
import styles from '../styles/components/SolutionCardItemStyles';
import { CardSection } from '../components/common';
import { addSolutionUpvote, removeSolutionUpvote, addSolutionDownvote, removeSolutionDownvote } from '../actions';

class SolutionsCardItem extends Component {

  upvoteSolution = (solution) => {
    const { user } = this.props;
    if (!user.solutionUpvotes.includes(solution.id)) {
      this.props.addSolutionUpvote(solution);
    } else {
      this.props.removeSolutionUpvote(solution);
    }
  }

  downvoteSolution = (solution) => {
    const { user } = this.props;
    // If user hasn't downvoted this solution, add an downvote
    if (!user.solutionDownvotes.includes(solution.id)) {
      this.props.addSolutionDownvote(solution);
    } else {
      this.props.removeSolutionDownvote(solution);
    }
  }

  renderSolutionUpvoteButton = (solution) => {
    const { user } = this.props;
    let iconColor = 'grey';

    if (user.solutionUpvotes.includes(solution.id)) {
      iconColor = '#48D2A0';
    }
    return (
      <TouchableOpacity onPress={() => this.upvoteSolution(solution)}>
        <View>
          <Icon name="thumb-up" size={30} color={iconColor} />
        </View>
      </TouchableOpacity>
    );
  }

  renderSolutionDownvoteButton = (solution) => {
    const { user } = this.props;
    let iconColor = 'grey';
    // If user hasn't downvoted this solution
    if (user.solutionDownvotes.includes(solution.id)) {
      iconColor = '#F54B5E';
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
          <Text style={solutionText}>{solution.text}</Text>

          {/* Upvote count and button */}
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Text style={{ fontSize: 18, color: '#48D2A0' }}>{solution.upvotes}</Text>
                <Icon size={18} name='arrow-upward' color= '#48D2A0' />
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Text style={{ fontSize: 18, color: '#F54B5E' }}> { solution.downvotes }</Text>
                <Icon size={18} name='arrow-downward' color='#F54B5E' />
              </View>
            </View>
            <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
              {this.renderSolutionDownvoteButton(solution)}
              {this.renderSolutionUpvoteButton(solution)}
            </View>
          </View>
        </View>
      </CardSection>
    );
  }
}

SolutionsCardItem.propTypes = {
  solution: PropTypes.object,
  user: PropTypes.object,
  addSolutionUpvote: PropTypes.func,
  removeSolutionUpvote: PropTypes.func,
  addSolutionDownvote: PropTypes.func,
  removeSolutionDownvote: PropTypes.func,
  group: PropTypes.object,
};

function mapStateToProps(state) {
  const { user, group } = state;
  return { user, group };
}

export default connect(mapStateToProps, {
  addSolutionUpvote,
  removeSolutionUpvote,
  addSolutionDownvote,
  removeSolutionDownvote,
})(SolutionsCardItem);
