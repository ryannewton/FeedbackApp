// Import Libraries
import React, { Component } from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';

// Import componenets, functions, and styles
import styles from '../styles/components/ProjectStyles';
import { Card } from './common';
import { addProjectUpvote, removeProjectUpvote, addProjectDownvote, removeProjectDownvote } from '../actions';

// Import tracking
// import { tracker } from '../constants';

class Project extends Component {
  constructor(props) {
    super(props);

    this.upvote = this.upvote.bind(this);
    this.downvote = this.downvote.bind(this);
    this.renderStatusBox = this.renderStatusBox.bind(this);
    this.goToDetails = this.goToDetails.bind(this);
  }

  goToDetails() {
    this.props.navigate('Details', { project: this.props.project });
  }

  renderImage() {
    if (this.props.renderImage && this.props.project.imageURL) {
      const { imageURL } = this.props.project;
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
          <Image
            source={{ uri: imageURL }}
            style={{ width: 200, height: 200 }}
          />
        </View>
      );
    }
    return null;
  }
  upvote() {
    const { project, user } = this.props;
    // If user hasn't upvoted this project, add an upvote
    if (!user.projectUpvotes.includes(project.id)) {
      // tracker.trackEvent('Project Vote', 'Project UpVote Via Project Button', { label: this.props.features.domain });
      this.props.addProjectUpvote(project);
    } else {
      // tracker.trackEvent('Remove Project Vote', 'Remove Project UpVote Via Project Button', { label: this.props.features.domain });
      this.props.removeProjectUpvote(project);
    }
  }
  downvote() {
    const { project, user } = this.props;
    // If user hasn't downvoted this project, add an downvote
    if (!user.projectDownvotes.includes(project.id)) {
      // tracker.trackEvent('Project Vote', 'Project DownVote Via Project Button', { label: this.props.features.domain });
      this.props.addProjectDownvote(project);
    } else {
      // tracker.trackEvent('Remove Project Vote', 'Remove Project DownVote Via Project Button', { label: this.props.features.domain });
      this.props.removeProjectDownvote(project);
    }
  }
  renderOfficialResponseTag() {
    if (this.props.renderOfficalResponseTag) {
      const exists = Boolean(this.props.project.response);
      if (exists) {
        const wantToRender = Boolean(this.props.responseTag);
        const responseExists = (this.props.project.response.text !== '');

        if (wantToRender && responseExists) {
          return (
            <View style={{ paddingTop: 15 }}>
              <Icon name="transcribe-close" type="material-community" color="blue" />
            </View>
          );
        }
      }
    }
    return null;
  }
  // Temporary fix. Async issue is causing this.props.project to be temporarily undefined
  renderVoteCount() {
    if (this.props.project === undefined) {
      return '';
    }
    return `${this.props.project.votes}`;
  }
  renderDownvoteCount() {
    if (this.props.project === undefined) {
      return '';
    }
    return `${this.props.project.downvotes}`;
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
      iconColor = 'green';
    }
    return (
      <View>
        <Icon name="thumb-up" size={35} color={iconColor} />
      </View>
    );
  }
  renderThumbDownButton() {
    const { project, user } = this.props;
    let iconColor = 'grey';
    // If user hasn't upvoted this project
    if (user.projectDownvotes.includes(project.id)) {
      iconColor = '#b6001e';
    }
    return (
      <View>
        <Icon name="thumb-down" size={35} color={iconColor} />
      </View>
    );
  }

  renderStatus() {
    if (this.props.renderStatus) {
      const { stage } = this.props.project;
      if (stage && stage === 'complete') {
        return <Icon name="done" size={35} color={'#006400'} />;
      }
      if (stage && stage === 'inprocess') {
        return <Icon name="sync" size={35} color={'#00008B'} />;
      }
      return <Icon name="fiber-new" size={35} color={'#A9A9A9'} />;
    }
  }

  renderStatusBox() {
    if (this.props.features.showStatus) {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          {this.renderStatus()}
        </View>
      );
    }
    return null;
  }

  render() {
    const { buttonText, lowWeight, row, projectTitle } = styles;
    let updatedRow = row;
    if (this.props.project.type === 'positive feedback') {
      updatedRow = [row, { backgroundColor: '#98FB98', shadowOffset: { width: 10, height: 10 } }];
    } else if (this.props.project.type === 'negative feedback') {
      updatedRow = [row, { backgroundColor: '#F08080', shadowOffset: { width: 10, height: 10 } }];
    }
    return (
      <Card>
        <TouchableHighlight
          style={updatedRow}
          underlayColor="#D0D0D0"
          onPress={this.goToDetails}
        >
          <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* First row */}{/* Project title */}
            <View style={{ flex: 5, paddingTop: 5 }}>
              <Text style={projectTitle}>
                {this.renderTitle()}
              </Text>
              {/* Vote count */}
            </View>
            {this.renderImage()}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', paddingTop: 5, justifyContent: 'flex-end' }}>
                  <Text style={[buttonText, lowWeight, { color: 'green', fontSize: 20 }]}>
                    {this.renderVoteCount()}
                  </Text>
                  <Icon size={18} name="arrow-upward" color="green" />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Text style={[buttonText, lowWeight, { color: 'red', fontSize: 20 }]}>
                    {this.renderDownvoteCount()}
                  </Text>
                  <Icon size={18} name="arrow-downward" color="red" />
                </View>
              </View>
              {this.renderStatusBox()}
              {this.renderOfficialResponseTag()}
              {/* Upvote Button */}
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                <TouchableOpacity onPress={this.downvote} style={{ paddingRight: 5 }}>
                  {this.renderThumbDownButton()}
                </TouchableOpacity>
                <TouchableOpacity onPress={this.upvote}>
                  {this.renderButton()}
                </TouchableOpacity>
              </View>
              {/* Status box */}

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
  addProjectDownvote: React.PropTypes.func,
  removeProjectDownvote: React.PropTypes.func,
  features: React.PropTypes.object,
};

const mapStateToProps = (state) => {
  const { user, features } = state;
  return { user, features };
};

export default connect(mapStateToProps, {
  addProjectUpvote,
  removeProjectUpvote,
  addProjectDownvote,
  removeProjectDownvote,
})(Project);
