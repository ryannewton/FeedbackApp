// Import Libraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import PropTypes from 'prop-types';

import fullScreen from '../../images/icons/default.jpg';
import noOpinionY from '../../images/icons/meh_y.png';
import noOpinionG from '../../images/icons/meh_g2.png';

// Import componenets, functions, and styles
import styles from '../styles/components/FeedbackCardStyles';
import { Card, CardSection } from './common';

import {
  addFeedbackUpvote,
  removeFeedbackUpvote,
  addFeedbackDownvote,
  removeFeedbackDownvote,
  addToDoNotDisplayList,
  addFeedbackNoOpinion,
  removeFeedbackNoOpinion,
} from '../actions';

class Feedback extends Component {
  goToDetails = () => {
    this.props.navigate('Details', { feedback: this.props.feedback });
  }

  addNoOpinion = () => {
    const { feedback, user } = this.props;
    if (!user.feedbackNoOpinions.includes(feedback.id)) {
      this.props.addFeedbackNoOpinion(feedback);
    } else {
      this.props.removeFeedbackNoOpinion(feedback);
    }
  }

  // If user hasn't upvoted this feedback, add an upvote - if they have, remove it
  upvote = () => {
    const { feedback, user } = this.props;
    if (!user.feedbackUpvotes.includes(feedback.id)) {
      this.props.addFeedbackUpvote(feedback);
    } else {
      this.props.removeFeedbackUpvote(feedback);
    }
    this.props.addToDoNotDisplayList(feedback.id)
  }

  // If user hasn't downvoted this feedback, add an downvote - if they have, remove it
  downvote = () => {
    const { feedback, user } = this.props;    
    if (!user.feedbackDownvotes.includes(feedback.id)) {
      this.props.addFeedbackDownvote(feedback);
    } else {
      this.props.removeFeedbackDownvote(feedback);
    }
    this.props.addToDoNotDisplayList(feedback.id)
  }

  renderTitle = () => {
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

  renderNoOpinionButton = () => {
    const { feedback, user } = this.props;
    let noOpinionN = noOpinionG;
    // If user hasn't upvoted this feedback
    if (user.feedbackNoOpinions.includes(feedback.id)) {
      noOpinionN = noOpinionY;
    }
    return (
      <View>
        <Image
          source={noOpinionN}
          style={{
            height: 17,
            resizeMode: 'contain',
          }}
        />
      </View>
    );
  }

  renderThumbUpButton = () => {
    const { feedback, user } = this.props;
    let iconColor = 'grey';
    // If user hasn't upvoted this feedback
    if (user.feedbackUpvotes.includes(feedback.id)) {
      iconColor = '#48D2A0';
    }
    return (
      <View>
        <Icon name="thumb-up" size={30} color={iconColor} />
      </View>
    );
  }
  renderThumbDownButton = () => {
    const { feedback, user } = this.props;
    let iconColor = 'grey';
    // If user hasn't upvoted this feedback
    if (user.feedbackDownvotes.includes(feedback.id)) {
      iconColor = '#F54B5E';
    }
    return (
      <View>
        <Icon name="thumb-down" size={30} color={iconColor} />
      </View>
    );
  }

  renderStatus = () => {
    const { status } = this.props.feedback;
    if (status && status === 'complete') {
      return <Icon name="done" size={30} color={'#48D2A0'} />;
    }
    if (status && status === 'inprocess') {
      return <Icon name="sync" size={30} color={'#F8C61C'} />;
    }
    return <Icon name="fiber-new" size={30} color={'#00A2FF'} />;
  }

  renderStatusBox = () => {
    if (this.props.group.showStatus) {
      return (
        <View style={{ paddingRight: 10 }}>
          {this.renderStatus()}
        </View>
      );
    }
    return null;
  }

  renderOfficialResponseTag = () => {
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
      <View style={{ paddingRight: 10, paddingTop: 10 }}>
        <Icon name="verified-user" color="blue" />
      </View>
    );
  }

  renderImage = () => {
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

  renderSmallImage = () => {
    const { imageURL } = this.props.feedback;
    const { showImage } = this.props;
    const { imageStyle, imageViewStyle } = styles;
    const { status } = this.props.feedback;
    if (showImage) {
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
            width: 80,
            height: 80,
            resizeMode: 'cover',
          }}
        >
        </Image>
      </View>
    );
  }

  renderSolutionsTag = () => {
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

  renderImageIcon = () => {
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
        <View style={{ flexDirection: 'column'}}>
          <View style={{ flexDirection: 'row'}}>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
              {/* First row */}{/* Project title */}
              <View style={{  paddingTop: 5 }}>
                {this.renderTitle()}
              </View>
              {/* Render image*/}
              {this.renderImage()}
            </View>
            <View style={{ alignSelf: 'center' }}>
              {/* Render image*/}
              {this.renderSmallImage()}
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
              {this.renderStatusBox()}
              {this.renderOfficialResponseTag()}
              {this.renderSolutionsTag()}
            </View>
            {/* Vote count */}
            <View style={{ flex: 1, flexDirection: 'row'}}>
              {/* Upvote Button and Downvote */}
                <TouchableOpacity onPress={this.downvote} style={{ paddingRight: 0 }}>
                  {this.renderThumbDownButton()}
                </TouchableOpacity>
                <Text style={downvoteTextStyle, { paddingTop: 7}}>
                  {this.props.feedback.downvotes}
                </Text>
                <TouchableOpacity onPress={this.addNoOpinion} style={{ paddingTop: 5 }}>
                  {this.renderNoOpinionButton()}
                </TouchableOpacity>
                <Text style={upvoteTextStyle, {paddingRight: 0, paddingTop: 7}}>
                  {this.props.feedback.noOpinions}
                </Text>
                <TouchableOpacity onPress={this.upvote} style={{ paddingRight: 0 }}>
                  {this.renderThumbUpButton()}
                </TouchableOpacity>
                <Text style={upvoteTextStyle, {paddingRight: 0, paddingTop: 7}}>
                  {this.props.feedback.upvotes}
                </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

Feedback.propTypes = {
  feedback: PropTypes.object,
  navigate: PropTypes.func,
  user: PropTypes.object,
  addFeedbackUpvote: PropTypes.func,
  removeFeedbackUpvote: PropTypes.func,
  addFeedbackDownvote: PropTypes.func,
  removeFeedbackDownvote: PropTypes.func,
  group: PropTypes.object,
  showResponseTag: PropTypes.bool,
  showImage: PropTypes.bool,
  solutions: PropTypes.object,
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
