// Import Libraries
import React, { Component } from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';

// Import componenets, functions, and styles
import styles from '../styles/components/ProjectStyles';
import { Card } from './common';
import { addProjectUpvote, removeProjectUpvote } from '../actions';

class Project extends Component {
  goToDetails() {
    this.props.navigate('Details', { project: this.props.project });
  }

  upvote() {
    const { project, user } = this.props;
    // If user hasn't upvoted this project, add an upvote
    if (!user.projectUpvotes.includes(project.id)) {
      this.props.addProjectUpvote(project);
    } else {
      this.props.removeProjectUpvote(project);
    }
  }

  // Temporary fix. Async issue is causing this.props.project to be temporarily undefined
  renderVoteCount() {
    if (this.props.project === undefined) {
      return '';
    }
    return `${this.props.project.votes} Votes`;
  }

  // Temporary fix. Async issue is causing this.props.project to be temporarily undefined
  renderTitle() {
    if (this.props.project === undefined) {
      return '';
    }
    return this.props.project.title;
  }

  renderButton() {
    const { project, user } = this.props;
    let iconColor = 'grey';
    // If user hasn't upvoted this project
    if (user.projectUpvotes.includes(project.id)) {
      iconColor = '#b6001e';
    }
    return (
      <TouchableOpacity onPress={this.upvote.bind(this)}>
        <View>
          <Icon name="thumb-up" size={35} color={iconColor} />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { buttonText, lowWeight, row, projectTitle } = styles;

    return (
      <Card>
        <TouchableHighlight
          style={row}
          underlayColor="#D0D0D0"
          onPress={this.goToDetails.bind(this)}
        >

          <View style={{ justifyContent: 'flex-start' }}>
            {/* Project title */}
            <Text style={projectTitle}>
              {this.renderTitle()}
            </Text>

            {/* Vote section */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
              {/* Vote count */}
              <View style={{ flex: 3 }}>
                <Text style={[buttonText, lowWeight]}>
                  {this.renderVoteCount()}
                </Text>
              </View>

              {/* Upvote button */}
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                {this.renderButton()}
              </View>
            </View>
          </View>

        </TouchableHighlight>
      </Card>
    );
  }
}

Project.propTypes = {
  project: React.PropTypes.object,
  navigate: React.PropTypes.func,
  user: React.PropTypes.object,
  addProjectUpvote: React.PropTypes.func,
  removeProjectUpvote: React.PropTypes.func,
};

const mapStateToProps = (state) => {
  const { user } = state;
  return { user };
};

export default connect(mapStateToProps, { addProjectUpvote, removeProjectUpvote })(Project);
