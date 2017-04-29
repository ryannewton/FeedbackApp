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
  constructor(props) {
    super(props);

    this.upvote = this.upvote.bind(this);
    this.renderStatusBox = this.renderStatusBox.bind(this);
  }

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
      <View>
        <Icon name="thumb-up" size={35} color={iconColor} />
      </View>
    );
  }

  renderStatus() {
    const { stage } = this.props.project;
    if (stage && stage === 'complete') {
      return <Icon name="done" size={35} color={'#006400'} />;
    } else if (stage && stage === 'inprocess') {
      return <Icon name="sync" size={35} color={'#00008B'} />;
    } else {
      return <Icon name="block" size={35} color={'#A9A9A9'} />;
    }
  }

  renderStatusBox() {
    if (this.props.showStatus) {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Text style={{ paddingRight: 3 }}>{this.props.project.stage}</Text>
          {this.renderStatus()}
        </View>
      );
    }
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
          <View style={{ flexDirection: 'column', justifyContent: 'space-between'}}>
            {/* First row */}{/* Project title */}
            <View style={{ flex: 5, paddingTop: 5 }}>
              <Text style={projectTitle}>
                {this.renderTitle()}
              </Text>
              {/* Vote count */}
              <View>
                <Text style={[buttonText, lowWeight]}>
                  {this.renderVoteCount()}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>

              {/* Upvote Button */}
              <TouchableOpacity onPress={this.upvote}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Text style={{ paddingRight: 3 }}>Upvote</Text>
                  {this.renderButton()}
                </View>
              </TouchableOpacity>

              {/* Status box */}
              {this.renderStatusBox()}
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
  const { showStatus } = state.features;
  return { user, showStatus };
};

export default connect(mapStateToProps, { addProjectUpvote, removeProjectUpvote })(Project);
