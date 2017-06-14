// Import Libraries
import React, { Component } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Container, DeckSwiper } from 'native-base';
import { connect } from 'react-redux';

// Import Components
import SwipeCard from '../components/SwipeCard';

// Import actions and styles
import { addProjectUpvote, addToDoNotDisplayList, closeInstructions, addProjectDownvote } from '../actions';
import styles from '../styles/scenes/FeedbackSwipeStyles';

// Import about info image
import styles2 from '../styles/scenes/FullscreenStyle';
import fullScreen from '../../images/backgrounds/SwipeInfo.jpg';

// Import tracking
// import { tracker } from '../constants';

const inboxZeroProject = {
  title: "Great job! You've reached inbox zero.",
  votes: 999,
  downvotes: 999,
};

class FeedbackSwipe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      projects: [...props.projects.list.filter(feedbackItem =>
        (!props.user.doNotDisplayList.includes(feedbackItem.id) && feedbackItem.stage !== 'complete'),
      ), inboxZeroProject],
    };
    // tracker.trackScreenViewWithCustomDimensionValues('New Projects', { domain: props.features.domain, project: String(this.state.projects[0].id) });

    this.swipeRight = this.swipeRight.bind(this);
    this.swipeLeft = this.swipeLeft.bind(this);
    this.closeInstructions = this.closeInstructions.bind(this);
  }

  swipeRight(source) {
    if (source === 'button') {
      // tracker.trackEvent('Project Vote', 'Project UpVote Via New Projects Button', { label: this.props.features.domain });
    } else {
      // tracker.trackEvent('Project Vote', 'Project UpVote Via Swipe', { label: this.props.features.domain });
    }

    const { user } = this.props;
    const project = this.state.projects[this.state.index];

    // If user hasn't upvoted this project, add an upvote
    if (project.id && !user.projectUpvotes.includes(project.id)) {
      this.props.addProjectUpvote(project);
    } else if (project.id) {
      this.props.addToDoNotDisplayList(project.id);
    }

    if (this.state.index === this.state.projects.length - 1) {
      this.setState({ index: 0, projects: [inboxZeroProject] });
    } else {
      this.setState({ index: this.state.index + 1 });
    }
  }

  swipeLeft(source) {
    if (source === 'button') {
      // tracker.trackEvent('Skip', 'Skip Via New Projects Button', { label: this.props.features.domain });
    } else {
      // tracker.trackEvent('Skip', 'Skip Via Swipe', { label: this.props.features.domain });
    }

    const { user } = this.props;
    const project = this.state.projects[this.state.index];

    // If user hasn't upvoted this project, add an upvote
    if (project.id && !user.projectUpvotes.includes(project.id)) {
      this.props.addProjectDownvote(project);
    } else if (project.id) {
      this.props.addToDoNotDisplayList(project.id);
    }

    if (this.state.index === this.state.projects.length - 1) {
      this.setState({ index: 0, projects: [inboxZeroProject] });
    } else {
      this.setState({ index: this.state.index + 1 });
    }
  }

  closeInstructions() {
    this.props.closeInstructions('New Projects Scene');
  }

  render() {
    const instructionsScreen = (
      <View style={{flex: 1}}>
        <TouchableOpacity onPress={this.closeInstructions}>
          <Image source={fullScreen} resizeMode="stretch" />
        </TouchableOpacity>
      </View>
    );

    const FeedbackSwipeScene = (
      <Container style = {{flexDirection: 'row'}}>
        <View style = {{flex:7, backgroundColor: '#A41034'}} />
        <View style={[styles.container, styles.swiper]}>
          <DeckSwiper
            ref={(ds) => { this.deckSwiper = ds; }}
            dataSource={this.state.projects}
            onSwipeRight={this.swipeRight}
            onSwipeLeft={this.swipeLeft}
            renderItem={project =>
              <SwipeCard
                project={project}
                right={() => {
                  this.swipeRight('button');
                  this.deckSwiper._root.swipeRight();
                }}
                left={() => {
                  this.swipeLeft('button');
                  this.deckSwiper._root.swipeLeft();
                }}
                skip={() => this.deckSwiper._root.swipeLeft()}
                features={this.props.features}
                navigate={this.props.navigation.navigate}
              />
            }
          />
        </View>
        <View style = {{flex:7, backgroundColor: '#A41034'}} />
      </Container>
    );

    const screenToShow = (!this.props.user.instructionsViewed.includes('New Projects Scene')) ? instructionsScreen : FeedbackSwipeScene;
    return screenToShow;
  }
}

FeedbackSwipe.propTypes = {
  projects: React.PropTypes.object,
  user: React.PropTypes.object,
  addToDoNotDisplayList: React.PropTypes.func,
  addProjectUpvote: React.PropTypes.func,
  features: React.PropTypes.object,
  addProjectUpvote: React.PropTypes.func,
};

function mapStateToProps(state) {
  const { user, projects, features } = state;
  return { user, projects, features };
}

export default connect(mapStateToProps, {
  addProjectUpvote,
  addProjectDownvote,
  addToDoNotDisplayList,
  closeInstructions,
})(FeedbackSwipe);
