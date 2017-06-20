// Import Libraries
import React, { Component } from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';

// Import componenets, functions, and styles
import styles from '../styles/components/FeedbackCardStyles';
import { Card } from './common';
import { addFeedbackUpvote, removeFeedbackUpvote, addFeedbackDownvote, removeFeedbackDownvote } from '../actions';

// Import tracking
// import { tracker } from '../constants';

class Feedback extends Component {
  constructor(props) {
    super(props);

    this.upvote = this.upvote.bind(this);
    this.downvote = this.downvote.bind(this);
    this.renderStatusBox = this.renderStatusBox.bind(this);
    this.goToDetails = this.goToDetails.bind(this);
  }

  goToDetails() {
    this.props.navigate('Details', { feedback: this.props.feedback });
  }

  upvote() {
    const { feedback, user } = this.props;
    // If user hasn't upvoted this feedback, add an upvote
    if (!user.feedbackUpvotes.includes(feedback.id)) {
      // tracker.trackEvent('Feedback Vote', 'Feedback UpVote Via Feedback Button', { label: this.props.group.domain });
      this.props.addFeedbackUpvote(feedback);
    } else {
      // tracker.trackEvent('Remove Feedback Vote', 'Remove Feedback UpVote Via Feedback Button', { label: this.props.group.domain });
      this.props.removeFeedbackUpvote(feedback);
    }
  }
  downvote() {
    const { feedback, user } = this.props;
    // If user hasn't downvoted this feedback, add an downvote
    if (!user.feedbackDownvotes.includes(feedback.id)) {
      // tracker.trackEvent('Feedback Vote', 'Feedback DownVote Via Feedback Button', { label: this.props.group.domain });
      this.props.addFeedbackDownvote(feedback);
    } else {
      // tracker.trackEvent('Remove Feedback Vote', 'Remove Feedback DownVote Via Feedback Button', { label: this.props.group.domain });
      this.props.removeFeedbackDownvote(feedback);
    }
  }
  // Temporary fix. Async issue is causing this.props.feedback to be temporarily undefined
  renderVoteCount() {
    if (this.props.feedback === undefined) {
      return '';
    }
    return `${this.props.feedback.upvotes}`;
  }
  renderDownvoteCount() {
    if (this.props.feedback === undefined) {
      return '';
    }
    return `${this.props.feedback.downvotes}`;
  }

  // Temporary fix. Async issue is causing this.props.feedback to be temporarily undefined
  renderTitle() {
    if (this.props.feedback === undefined) {
      return '';
    }
    return this.props.feedback.text;
  }

  renderThumbUpButton() {
    const { feedback, user } = this.props;
    let iconColor = 'grey';
    // If user hasn't upvoted this feedback
    if (user.feedbackUpvotes.includes(feedback.id)) {
      iconColor = 'green';
    }
    return (
      <View>
        <Icon name="thumb-up" size={35} color={iconColor} />
      </View>
    );
  }
  renderThumbDownButton() {
    const { feedback, user } = this.props;
    let iconColor = 'grey';
    // If user hasn't upvoted this feedback
    if (user.feedbackDownvotes.includes(feedback.id)) {
      iconColor = '#b6001e';
    }
    return (
      <View>
        <Icon name="thumb-down" size={35} color={iconColor} />
      </View>
    );
  }

  renderStatus() {
    const { status } = this.props.feedback;
    if (status && status === 'complete') {
      return <Icon name="done" size={35} color={'#006400'} />;
    }
    if (status && status === 'inprocess') {
      return <Icon name="sync" size={35} color={'#00008B'} />;
    }
    return <Icon name="fiber-new" size={35} color={'#A9A9A9'} />;
  }

  renderStatusBox() {
    if (this.props.group.showStatus) {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          {this.renderStatus()}
        </View>
      );
    }
    return null;
  }
  renderOfficialResponseTag() {
    const { feedback, showResponseTag } = this.props;
    if (!showResponseTag) {
      return null;
    }
    // Has the server been updated to include a response object?
    const exists = feedback.response && feedback.response.text !== '';
    if (!exists) {
      return null;
    }
    return (
      <View style={{ paddingTop: 15 }}>
        <Icon name="verified-user" color="blue" />
      </View>
    );
  }

  renderImage() {
    const { imageURL } = this.props.feedback;
    const { showImage } = this.props;
    const { imageStyle, imageViewStyle } = styles;
    if (!showImage) {
      return null;
    }

    // If feedback doesn't have a photo
    if (!imageURL) {
      return null;
    }
    return (
      <View style={imageViewStyle}>
        <Image
          source={{ uri: imageURL }}
          indicator={ProgressBar}
          indicatorProps={{
            size: 80,
            borderWidth: 0,
            color: 'rgba(150, 150, 150, 1)',
            unfilledColor: 'rgba(200, 200, 200, 0.2)',
          }}
          style={{
            width: 250,
            height: 250,
          }}
        />
      </View>
    );
  }

  renderImageIcon() {
    const { imageURL } = this.props.feedback;

    // Check if there is an image and we are not currently showing the image
    if (imageURL && !this.props.showImage) {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="image" color='#A9A9A9' />
        </View>
      );
    }
    return null;
  }

  render() {
    const {
      row,
      feedbackTitle,
      rowViewStyle,
      voteCountStyle,
      upvoteCountStyle,
      upvoteTextStyle,
      downvoteTextStyle,
      downvoteCountStyle,
      thumbStyle,
    } = styles;

    let updatedRow = row;
    if (this.props.feedback.type === 'positive feedback') {
      updatedRow = [row, { backgroundColor: '#98FB98', shadowOffset: { width: 10, height: 10 } }];
    } else if (this.props.feedback.type === 'negative feedback') {
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
              <Text style={feedbackTitle}>
                {this.renderTitle()}
              </Text>
            </View>

            {/* Render image*/}
            {this.renderImage()}

            {/* Vote count */}
            <View style={rowViewStyle}>
              <View style={voteCountStyle}>
                <View style={upvoteCountStyle}>
                  <Text style={upvoteTextStyle}>
                    {this.renderVoteCount()}
                  </Text>
                  <Icon size={18} name="arrow-upward" color="green" />
                </View>
                <View style={downvoteCountStyle}>
                  <Text style={downvoteTextStyle}>
                    {this.renderDownvoteCount()}
                  </Text>
                  <Icon size={18} name="arrow-downward" color="red" />
                </View>
              </View>

              {/* Render Status icon */}
              {this.renderStatusBox()}

              {/* Render image icon */}
              {this.renderImageIcon()}

              {/* Render official response tag */}
              {this.renderOfficialResponseTag()}

              {/* Upvote Button and Downvote */}
              <View style={thumbStyle}>
                <TouchableOpacity onPress={this.downvote} style={{ paddingRight: 5 }}>
                  {this.renderThumbDownButton()}
                </TouchableOpacity>
                <TouchableOpacity onPress={this.upvote}>
                  {this.renderThumbUpButton()}
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </TouchableHighlight>
      </Card>
    );
  }
}

Feedback.propTypes = {
  feedback: React.PropTypes.object,
  navigate: React.PropTypes.func,
  user: React.PropTypes.object,
  addFeedbackUpvote: React.PropTypes.func,
  removeFeedbackUpvote: React.PropTypes.func,
  addFeedbackDownvote: React.PropTypes.func,
  removeFeedbackDownvote: React.PropTypes.func,
  group: React.PropTypes.object,
  showResponseTag: React.PropTypes.bool,
  showImage: React.PropTypes.bool,
};

const mapStateToProps = (state) => {
  const { user, group } = state;
  return { user, group };
};

export default connect(mapStateToProps, {
  addFeedbackUpvote,
  removeFeedbackUpvote,
  addFeedbackDownvote,
  removeFeedbackDownvote,
})(Feedback);
