// Import Libraries
import React, { Component } from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';

// Import componenets, functions, and styles
import styles from '../styles/components/SuggestionStyles';
import { Card } from './common';
import { addSuggestionUpvote, removeSuggestionUpvote, addSuggestionDownvote, removeSuggestionDownvote } from '../actions';

// Import tracking
// import { tracker } from '../constants';

class Suggestion extends Component {
  constructor(props) {
    super(props);

    this.upvote = this.upvote.bind(this);
    this.downvote = this.downvote.bind(this);
    this.renderStatusBox = this.renderStatusBox.bind(this);
    this.goToDetails = this.goToDetails.bind(this);
  }

  goToDetails() {
    this.props.navigate('Details', { suggestion: this.props.suggestion });
  }

  upvote() {
    const { suggestion, user } = this.props;
    // If user hasn't upvoted this suggestion, add an upvote
    if (!user.suggestionUpvotes.includes(suggestion.id)) {
      // tracker.trackEvent('Suggestion Vote', 'Suggestion UpVote Via Suggestion Button', { label: this.props.group.domain });
      this.props.addSuggestionUpvote(suggestion);
    } else {
      // tracker.trackEvent('Remove Suggestion Vote', 'Remove Suggestion UpVote Via Suggestion Button', { label: this.props.group.domain });
      this.props.removeSuggestionUpvote(suggestion);
    }
  }
  downvote() {
    const { suggestion, user } = this.props;
    // If user hasn't downvoted this suggestion, add an downvote
    if (!user.suggestionDownvotes.includes(suggestion.id)) {
      // tracker.trackEvent('Suggestion Vote', 'Suggestion DownVote Via Suggestion Button', { label: this.props.group.domain });
      this.props.addSuggestionDownvote(suggestion);
    } else {
      // tracker.trackEvent('Remove Suggestion Vote', 'Remove Suggestion DownVote Via Suggestion Button', { label: this.props.group.domain });
      this.props.removeSuggestionDownvote(suggestion);
    }
  }
  // Temporary fix. Async issue is causing this.props.suggestion to be temporarily undefined
  renderVoteCount() {
    if (this.props.suggestion === undefined) {
      return '';
    }
    return `${this.props.suggestion.upvotes}`;
  }
  renderDownvoteCount() {
    if (this.props.suggestion === undefined) {
      return '';
    }
    return `${this.props.suggestion.downvotes}`;
  }

  // Temporary fix. Async issue is causing this.props.suggestion to be temporarily undefined
  renderTitle() {
    if (this.props.suggestion === undefined) {
      return '';
    }
    return this.props.suggestion.text;
  }

  renderButton() {
    const { suggestion, user } = this.props;
    let iconColor = 'grey';
    // If user hasn't upvoted this suggestion
    if (user.suggestionUpvotes.includes(suggestion.id)) {
      iconColor = 'green';
    }
    return (
      <View>
        <Icon name="thumb-up" size={35} color={iconColor} />
      </View>
    );
  }
  renderThumbDownButton() {
    const { suggestion, user } = this.props;
    let iconColor = 'grey';
    // If user hasn't upvoted this suggestion
    if (user.suggestionDownvotes.includes(suggestion.id)) {
      iconColor = '#b6001e';
    }
    return (
      <View>
        <Icon name="thumb-down" size={35} color={iconColor} />
      </View>
    );
  }

  renderStatus() {
    const { status } = this.props.suggestion;
    if (status && status === 'complete') {
      return <Icon name="done" size={35} color={'#006400'} />;
    }
    if (status && status === 'inprocess') {
      return <Icon name="sync" size={35} color={'#00008B'} />;
    }
    return <Icon name="block" size={35} color={'#A9A9A9'} />;
  }

  renderStatusBox() {
    if (this.props.group.showStatus) {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Text style={{ paddingRight: 3 }}>{this.props.suggestion.status}</Text>
          {this.renderStatus()}
        </View>
      );
    }
    return null;
  }

  render() {
    const { buttonText, lowWeight, row, suggestionTitle } = styles;
    let updatedRow = row;
    if (this.props.suggestion.type === 'positive feedback') {
      updatedRow = [row, { backgroundColor: '#98FB98', shadowOffset: { width: 10, height: 10 } }];
    } else if (this.props.suggestion.type === 'negative feedback') {
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
            {/* First row */}{/* Suggestion title */}
            <View style={{ flex: 5, paddingTop: 5 }}>
              <Text style={suggestionTitle}>
                {this.renderTitle()}
              </Text>
              {/* Vote count */}
            </View>

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

Suggestion.propTypes = {
  suggestion: React.PropTypes.object,
  navigate: React.PropTypes.func,
  user: React.PropTypes.object,
  addSuggestionUpvote: React.PropTypes.func,
  removeSuggestionUpvote: React.PropTypes.func,
  addSuggestionDownvote: React.PropTypes.func,
  removeSuggestionDownvote: React.PropTypes.func,
  group: React.PropTypes.object,
};

const mapStateToProps = (state) => {
  const { user, group } = state;
  return { user, group };
};

export default connect(mapStateToProps, {
  addSuggestionUpvote,
  removeSuggestionUpvote,
  addSuggestionDownvote,
  removeSuggestionDownvote,
})(Suggestion);
