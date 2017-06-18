// Import Libraries
import React, { Component } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Container, DeckSwiper } from 'native-base';
import { connect } from 'react-redux';

// Import Components
import SwipeCard from '../components/SwipeCard';

// Import actions and styles
import { addSuggestionUpvote, addToDoNotDisplayList, closeInstructions, addSuggestionDownvote } from '../actions';
import styles from '../styles/scenes/SuggestionSwipeStyles';

// Import about info image
import styles2 from '../styles/scenes/FullscreenStyle';
import fullScreen from '../../images/backgrounds/SwipeInfo.jpg';

// Import tracking
// import { tracker } from '../constants';

const inboxZeroSuggestion = {
  title: "Great job! You've reached inbox zero.",
  votes: 999,
  downvotes: 999,
};

class SuggestionSwipe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      suggestions: [...props.suggestions.list.filter(suggestionItem =>
        (!props.user.doNotDisplayList.includes(suggestionItem.id) && suggestionItem.stage !== 'complete'),
      ), inboxZeroSuggestion],
    };
    // tracker.trackScreenViewWithCustomDimensionValues('New Suggestions', { domain: props.group.domain, suggestion: String(this.state.suggestions[0].id) });

    this.swipeRight = this.swipeRight.bind(this);
    this.swipeLeft = this.swipeLeft.bind(this);
    this.closeInstructions = this.closeInstructions.bind(this);
  }

  swipeRight(source) {
    if (source === 'button') {
      // tracker.trackEvent('Suggestion Vote', 'Suggestion UpVote Via New Suggestions Button', { label: this.props.group.domain });
    } else {
      // tracker.trackEvent('Suggestion Vote', 'Suggestion UpVote Via Swipe', { label: this.props.group.domain });
    }

    const { user } = this.props;
    const suggestion = this.state.suggestions[this.state.index];

    // If user hasn't upvoted this suggestion, add an upvote
    if (suggestion.id && !user.suggestionUpvotes.includes(suggestion.id)) {
      this.props.addSuggestionUpvote(suggestion);
    }

    if (suggestion.id) {
      this.props.addToDoNotDisplayList(suggestion.id);
    }

    if (this.state.index === this.state.suggestions.length - 1) {
      this.setState({ index: 0, suggestions: [inboxZeroSuggestion] });
    } else {
      this.setState({ index: this.state.index + 1 });
    }
  }

  swipeLeft(source) {
    if (source === 'button') {
      // tracker.trackEvent('Skip', 'Skip Via New Suggestions Button', { label: this.props.group.domain });
    } else {
      // tracker.trackEvent('Skip', 'Skip Via Swipe', { label: this.props.group.domain });
    }

    const { user } = this.props;
    const suggestion = this.state.suggestions[this.state.index];

    // If user hasn't downvoted this suggestion, add an upvote
    if (suggestion.id && !user.suggestionDownvotes.includes(suggestion.id)) {
      this.props.addSuggestionDownvote(suggestion);
    }

    if (suggestion.id) {
      this.props.addToDoNotDisplayList(suggestion.id);
    }

    if (this.state.index === this.state.suggestions.length - 1) {
      this.setState({ index: 0, suggestions: [inboxZeroSuggestion] });
    } else {
      this.setState({ index: this.state.index + 1 });
    }
  }

  skip() {
    const suggestion = this.state.suggestions[this.state.index];
    if (suggestion.id) {
      this.props.addToDoNotDisplayList(suggestion.id);
    }

    if (this.state.index === this.state.suggestions.length - 1) {
      this.setState({ index: 0, suggestions: [inboxZeroSuggestion] });
    } else {
      this.setState({ index: this.state.index + 1 });
    }
  }

  closeInstructions() {
    this.props.closeInstructions('New Suggestions Scene');
  }

  render() {
    const instructionsScreen = (
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={this.closeInstructions}>
          <Image source={fullScreen} resizeMode="stretch" />
        </TouchableOpacity>
      </View>
    );

    const SuggestionSwipeScene = (
      <Container style={{ flexDirection: 'row' }}>
        <View style={{ flex: 7, backgroundColor: '#A41034' }} />
        <View style={[styles.container, styles.swiper]}>
          <DeckSwiper
            ref={(ds) => { this.deckSwiper = ds; }}
            dataSource={this.state.suggestions}
            onSwipeRight={this.swipeRight}
            onSwipeLeft={this.swipeLeft}
            renderItem={suggestion =>
              <SwipeCard
                suggestion={suggestion}
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

    // const screenToShow = (!this.props.user.instructionsViewed.includes('New Suggestions Scene')) ? instructionsScreen : SuggestionSwipeScene;
    return SuggestionSwipeScene;
  }
}

SuggestionSwipe.propTypes = {
  suggestions: React.PropTypes.object,
  user: React.PropTypes.object,
  addToDoNotDisplayList: React.PropTypes.func,
  addSuggestionUpvote: React.PropTypes.func,
  addSuggestionDownvote: React.PropTypes.func,
  closeInstructions: React.PropTypes.func,
  group: React.PropTypes.object,
  navigation: React.PropTypes.object,

};

function mapStateToProps(state) {
  const { user, suggestions, group } = state;
  return { user, suggestions, group };
}

export default connect(mapStateToProps, {
  addSuggestionUpvote,
  addSuggestionDownvote,
  addToDoNotDisplayList,
  closeInstructions,
})(SuggestionSwipe);
