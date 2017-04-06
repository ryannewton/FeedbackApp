// Import Libraries
import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, DeckSwiper } from 'native-base';
import { connect } from 'react-redux';

// Import Components
import SwipeCard from '../components/SwipeCard';
import RequireData from '../components/RequireData';

// Import actions and styles
import { addProjectUpvote, addToDoNotDisplayList } from '../actions';
import styles from '../styles/scenes/NewProjectsStyles';

class NewProjects extends Component {
  constructor(props) {
    super(props);

    console.log('constructor do not display list', props.user.doNotDisplayList);

    this.state = {
      index: 0,
      projects: props.projects.filter(project =>
        !props.user.doNotDisplayList
        .includes(project.id)),
    };

    this.swipeRight = this.swipeRight.bind(this);
    this.swipeLeft = this.swipeLeft.bind(this);
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.projects !== this.props.projects) {
  //     this.setState({
  //       projects: nextProps.projects
  //         .filter(project => !nextProps.user.doNotDisplayList.includes(project.id)),
  //     });
  //   }
  // }

  swipeRight() {
    console.log('swipe right');
    const { user } = this.props;
    const project = this.state.projects[this.state.index];

    // If user hasn't upvoted this project, add an upvote
    if (!user.projectUpvotes.includes(project.id)) {
      this.props.addProjectUpvote(project);
    }

    this.props.addToDoNotDisplayList(project.id);
    this.setState({ index: this.state.index + 1 });
  }

  swipeLeft() {
    console.log('swipe left');
    const project = this.state.projects[this.state.index];
    this.props.addToDoNotDisplayList(project.id);
    this.setState({ index: this.state.index + 1 });
  }

  render() {
    return (
      <Container>
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
                  this.swipeRight();
                  this.deckSwiper._root.swipeRight();
                }}
                left={() => {
                  this.swipeLeft();
                  this.deckSwiper._root.swipeLeft();
                }}
              />
            }
          />
        </View>
      </Container>
    );
  }
}

NewProjects.propTypes = {
  projects: React.PropTypes.array,
  user: React.PropTypes.object,
  addToDoNotDisplayList: React.PropTypes.func,
  addProjectUpvote: React.PropTypes.func,
};

function mapStateToProps(state) {
  const { user, projects } = state;
  return { user, projects };
}

export default connect(mapStateToProps, {
  addProjectUpvote,
  addToDoNotDisplayList,
})(RequireData(NewProjects));
