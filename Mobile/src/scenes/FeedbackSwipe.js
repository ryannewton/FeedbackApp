// Import Libraries
import React, { Component } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Container, DeckSwiper } from 'native-base';
import { connect } from 'react-redux';

// Import Components
import SwipeCard from '../components/SwipeCard';

// Import actions and styles
import { addFeedbackUpvote, addToDoNotDisplayList, closeInstructions, addFeedbackDownvote } from '../actions';
import styles from '../styles/scenes/FeedbackSwipeStyles';

// Import about info image
import styles2 from '../styles/scenes/FullscreenStyle';
import fullScreen from '../../images/backgrounds/SwipeInfo.jpg';

// Import tracking
// import { tracker } from '../constants';

const inboxZeroFeedback = {
  text: "Great job! You've reached inbox zero.",
  upvotes: 999,
  downvotes: 999,
};

class FeedbackSwipe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      feedback: [...props.feedback.list.filter(feedbackItem =>
        (!props.user.doNotDisplayList.includes(feedbackItem.id) && feedbackItem.stage !== 'complete'),
      ), inboxZeroFeedback],
    };
    // tracker.trackScreenViewWithCustomDimensionValues('New Feedback', { domain: props.group.domain, feedback: String(this.state.feedback[0].id) });
    
    this.swipeRight = this.swipeRight.bind(this);
    this.swipeLeft = this.swipeLeft.bind(this);
    this.closeInstructions = this.closeInstructions.bind(this);
  }

  swipeRight(source) {
    // if (source === 'button') {
    //   tracker.trackEvent('Feedback Vote', 'Feedback UpVote Via New Feedback Button', { label: this.props.group.domain });
    // } else {
    //   tracker.trackEvent('Feedback Vote', 'Feedback UpVote Via Swipe', { label: this.props.group.domain });
    // }

    const { user } = this.props;
    const feedback = this.state.feedback[this.state.index];

    // If user hasn't upvoted this feedback, add an upvote
    if (feedback.id && !user.feedbackUpvotes.includes(feedback.id)) {
      this.props.addFeedbackUpvote(feedback);
    }

    if (feedback.id) {
      this.props.addToDoNotDisplayList(feedback.id);
    }

    if (this.state.index === this.state.feedback.length - 1) {
      this.setState({ index: 0, feedback: [inboxZeroFeedback] });
    } else {
      this.setState({ index: this.state.index + 1 });
    }
  }

  swipeLeft(source) {
    // if (source === 'button') {
    //   tracker.trackEvent('Skip', 'Skip Via New Feedback Button', { label: this.props.group.domain });
    // } else {
    //   tracker.trackEvent('Skip', 'Skip Via Swipe', { label: this.props.group.domain });
    // }

    const { user } = this.props;
    const feedback = this.state.feedback[this.state.index];

    // If user hasn't downvoted this feedback, add an upvote
    if (feedback.id && !user.feedbackDownvotes.includes(feedback.id)) {
      this.props.addFeedbackDownvote(feedback);
    }

    if (feedback.id) {
      this.props.addToDoNotDisplayList(feedback.id);
    }

    if (this.state.index === this.state.feedback.length - 1) {
      this.setState({ index: 0, feedback: [inboxZeroFeedback] });
    } else {
      this.setState({ index: this.state.index + 1 });
    }
  }

  skip() {
    const feedback = this.state.feedback[this.state.index];
    if (feedback.id) {
      this.props.addToDoNotDisplayList(feedback.id);
    }

    if (this.state.index === this.state.feedback.length - 1) {
      this.setState({ index: 0, feedback: [inboxZeroFeedback] });
    } else {
      this.setState({ index: this.state.index + 1 });
    }
  }

  closeInstructions() {
    this.props.closeInstructions('New Feedback Scene');
  }

  render() {
    const instructionsScreen = (
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={this.closeInstructions}>
          <Image source={fullScreen} resizeMode="stretch" />
        </TouchableOpacity>
      </View>
    );

    const FeedbackSwipeScene = (
      <Container style={{ flexDirection: 'row' }}>
        <View style={{ flex: 7, backgroundColor: '#A41034' }} />
        <View style={[styles.container, styles.swiper]}>
          <DeckSwiper
            ref={(ds) => { this.deckSwiper = ds; }}
            dataSource={this.state.feedback}
            onSwipeRight={this.swipeRight}
            onSwipeLeft={this.swipeLeft}
            renderItem={feedback =>
              <SwipeCard
                feedback={feedback}
                right={() => {
                  this.swipeRight('button');
                  this.deckSwiper._root.swipeRight();
                }}
                left={() => {
                  this.swipeLeft('button');
                  this.deckSwiper._root.swipeLeft();
                }}
                skip={() => {
                  this.skip();
                  this.deckSwiper._root.swipeLeft();
                }}
                group={this.props.group}
                navigate={this.props.navigation.navigate}
              />
            }
          />
        </View>
        <View style={{ flex: 7, backgroundColor: '#A41034' }} />
      </Container>
    );

    // const screenToShow = (!this.props.user.instructionsViewed.includes('New Feedback Scene')) ? instructionsScreen : FeedbackSwipeScene;
    return FeedbackSwipeScene;
  }
}

FeedbackSwipe.propTypes = {
  feedback: React.PropTypes.object,
  user: React.PropTypes.object,
  addToDoNotDisplayList: React.PropTypes.func,
  addFeedbackUpvote: React.PropTypes.func,
  addFeedbackDownvote: React.PropTypes.func,
  closeInstructions: React.PropTypes.func,
  group: React.PropTypes.object,
  navigation: React.PropTypes.object,

};

function mapStateToProps(state) {
  const { user, feedback, group } = state;
  return { user, feedback, group };
}

export default connect(mapStateToProps, {
  addFeedbackUpvote,
  addFeedbackDownvote,
  addToDoNotDisplayList,
  closeInstructions,
})(FeedbackSwipe);
