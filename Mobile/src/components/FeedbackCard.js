// Import Libraries
import React, { Component } from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import fullScreen from '../../images/icons/default.jpg';

// Import componenets, functions, and styles
import styles from '../styles/components/FeedbackCardStyles';
import { Card } from './common';
import {
  addFeedbackUpvote,
  removeFeedbackUpvote,
  addFeedbackDownvote,
  removeFeedbackDownvote,
  addToDoNotDisplayList,
  addFeedbackNoOpinion,
  removeFeedbackNoOpinion,
} from '../actions';

// Import tracking
// import { tracker } from '../constants';

class Feedback extends Component {
  constructor(props) {
    super(props);

    this.upvote = this.upvote.bind(this);
    this.downvote = this.downvote.bind(this);
    this.renderStatusBox = this.renderStatusBox.bind(this);
    this.goToDetails = this.goToDetails.bind(this);
    this.addNoOpinion = this.addNoOpinion.bind(this);
  }

  goToDetails() {
    this.props.navigate('Details', { feedback: this.props.feedback });
  }

  addNoOpinion() {
    const { feedback, user } = this.props;
    console.log(feedback)
    if (!user.feedbackNoOpinions.includes(feedback.id)) {
      this.props.addFeedbackNoOpinion(feedback);
    } else {
      this.props.removeFeedbackNoOpinion(feedback);
    }
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
    this.props.addToDoNotDisplayList(feedback.id)
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
    this.props.addToDoNotDisplayList(feedback.id)
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
    } else if (this.props.user.feedbackUpvotes.includes(this.props.feedback.id) ||
              this.props.user.feedbackDownvotes.includes(this.props.feedback.id) ||
              this.props.user.feedbackNoOpinions.includes(this.props.feedback.id)) {
      return (
        <Text
          style={{
            fontSize: 18,
            color: 'black',
            fontWeight: '400',
          }}
        >
          {this.props.feedback.text}
        </Text>
      );
    }
    return (
      <Text
        style={{
          fontSize: 18,
          color: 'black',
          fontWeight: 'bold',
        }}
      >
        {this.props.feedback.text}
      </Text>
    );
  }

  renderNoOpinionButton() {
    const { feedback, user } = this.props;
    let iconColor = 'grey';
    // If user hasn't upvoted this feedback
    if (user.feedbackNoOpinions.includes(feedback.id)) {
      iconColor = '#F8C61C';
    }
    return (
      <View>
        <Icon name="thumb-up" size={35} color={iconColor} />
      </View>
    );
  }
  renderThumbUpButton() {
    const { feedback, user } = this.props;
    let iconColor = 'grey';
    // If user hasn't upvoted this feedback
    if (user.feedbackUpvotes.includes(feedback.id)) {
      iconColor = '#48D2A0';
    }
    return (
      <View>
        <Icon name="thumb-up" size={25} color={iconColor} />
      </View>
    );
  }
  renderThumbDownButton() {
    const { feedback, user } = this.props;
    let iconColor = 'grey';
    // If user hasn't upvoted this feedback
    if (user.feedbackDownvotes.includes(feedback.id)) {
      iconColor = '#F54B5E';
    }
    return (
      <View>
        <Icon name="thumb-down" size={25} color={iconColor} />
      </View>
    );
  }

  renderStatus() {
    const { status } = this.props.feedback;
    if (status && status === 'complete') {
      return <Icon name="done" size={30} color={'#48D2A0'} />;
    }
    if (status && status === 'inprocess') {
      return <Icon name="sync" size={30} color={'#F8C61C'} />;
    }
    return <Icon name="fiber-new" size={30} color={'#00A2FF'} />;
  }

  renderStatusBox() {
    if (this.props.group.showStatus) {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
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
    const exists = feedback.officialReply && feedback.officialReply.text !== '';
    if (!exists) {
      return null;
    }
    return (
      <View style={{ paddingRight: 10 }}>
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
            resizeMode: 'contain',
          }}
        />
      </View>
    );
  }

  renderSmallImage() {
    const { imageURL } = this.props.feedback;
    const { showImage } = this.props;
    const { imageStyle, imageViewStyle } = styles;
    const { status } = this.props.feedback;
    if (showImage) {
      return null;
    }

    // If feedback doesn't have a photo
    if (!imageURL) {
    if (status && status === 'complete') {
      return <Icon name="done" size={100} color={'#48D2A0'} />;
    }
    if (status && status === 'inprocess') {
      return <Icon name="sync" size={100} color={'#F8C61C'} />;
    }
    return <Icon name="fiber-new" size={100} color={'#00A2FF'} />;
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
            width: 100,
            height: 100,
            resizeMode: 'cover',
          }}
        >
          {/* Render Status icon */}
          {this.renderStatusBox()}
        </Image>
      </View>
    );
  }

  renderSolutionsTag() {
    const { solutions, feedback } = this.props;
    const feedbackSolutions = solutions.list.filter(solution => solution.feedbackId === feedback.id);
    if (feedbackSolutions.length) {
      return (
        <View>
          <Icon name="question-answer" color="grey" />
        </View>
      );
    }
    return null;
  }

  renderImageIcon() {
    const { imageURL } = this.props.feedback;

    // Check if there is an image and we are not currently showing the image
    if (imageURL && !this.props.showImage) {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="image" color="#A9A9A9" />
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
      updatedRow = [row, { borderColor: '#fff', borderWidth: 2 }];
    } else if (this.props.feedback.type === 'negative feedback') {
      updatedRow = [row, { borderColor: '#fff', borderWidth: 2 }];
    } else if (this.props.user.feedbackUpvotes.includes(this.props.feedback.id) ||
              this.props.user.feedbackDownvotes.includes(this.props.feedback.id) ||
              this.props.user.feedbackNoOpinions.includes(this.props.feedback.id)) {
      updatedRow = [row, { backgroundColor: 'rgba(248, 248, 248, 248)', borderWidth: 2, borderColor: '#fff' }];
    }

    return (
        <View style={updatedRow}>
        <View style={{ flexDirection: 'row'}}>
          <View style={{ alignSelf: 'center' }}>
                      {/* Render image*/}
            {this.renderSmallImage()}
          </View>
          <View style={{ flex: 8, flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* First row */}{/* Project title */}
            <View style={{ flex: 5, paddingTop: 5 }}>
              {this.renderTitle()}
            </View>

            {/* Render image*/}
            {this.renderImage()}
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', paddingLeft: 15, paddingBottom: 10}}>
              {/* Render official response tag */}
              {this.renderOfficialResponseTag()}
              {this.renderSolutionsTag()}
            </View>
            {/* Vote count */}
            <View style={{flexDirection: 'row', paddingBottom: 10}}>
              {/* Upvote Button and Downvote */}
                <TouchableOpacity onPress={this.downvote} style={{ paddingRight: 5 }}>
                  {this.renderThumbDownButton()}
                </TouchableOpacity>
                <Text style={downvoteTextStyle, {paddingRight: 12, paddingTop: 7}}>
                  {this.renderDownvoteCount()}
                </Text>
                <TouchableOpacity onPress={this.addNoOpinion} style={{ paddingRight: 5 }}>
                  {this.renderNoOpinionButton()}
                </TouchableOpacity>
                <TouchableOpacity onPress={this.upvote} style={{ paddingRight: 5 }}>
                  {this.renderThumbUpButton()}
                </TouchableOpacity>
                <Text style={upvoteTextStyle, {paddingRight: 1, paddingTop: 7}}>
                  {this.renderVoteCount()}
                </Text>
            </View>
            </View>
          </View>
        </View>
        </View>
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
  solutions: React.PropTypes.object,
};

const mapStateToProps = (state) => {
  const { user, group, solutions } = state;
  return { user, group, solutions };
};

export default connect(mapStateToProps, {
  addFeedbackUpvote,
  removeFeedbackUpvote,
  addFeedbackDownvote,
  removeFeedbackDownvote,
  addToDoNotDisplayList,
  addFeedbackNoOpinion,
  removeFeedbackNoOpinion,
})(Feedback);
