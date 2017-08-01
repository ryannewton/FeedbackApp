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
          <Icon name="arrow-drop-up" size={30} color={iconColor} />
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
          <Icon name="arrow-drop-down" size={30} color={iconColor} />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { solution } = this.props;
    const { solutionText, upvoteCountText } = styles;

    return (
      <CardSection>
        <View style={{ flexDirection:'row', flex: 1, alignItems:'center' }}>

          {/* Upvote count and button */}
          <View style={{ flexDirection: 'column', alignItems:'center', marginRight:10}}>
            <TouchableOpacity onPress={this.upvote} style={{ flexDirection: 'column', padding:5, paddingLeft:10, paddingRight:10}}>
              {this.renderSolutionUpvoteButton(solution)}
            </TouchableOpacity>
              <View style={{ flexDirection: 'row', marginTop:2, marginBottom:2}}>
                <Text style={{color: '#48D2A0', fontSize: 14}}>
                  {solution.upvotes}
                </Text>
                <Text style={{color:'grey', marginLeft:2, marginRight:2, fontSize: 14}}>
                  |
                </Text>
                <Text style={{color: '#F54B5E', fontSize: 14}}>
                  {solution.downvotes}
                </Text>
              </View>
            <TouchableOpacity onPress={this.downvote} style={{ flexDirection: 'column', padding:5, paddingLeft:10, paddingRight:10}}>
              {this.renderSolutionDownvoteButton(solution)}
            </TouchableOpacity>
          </View>

          {/* Solution description */}
          <View style={{flex: 8, paddingRight:5}}>
            <Text style={solutionText}>{solution.text}</Text>
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
