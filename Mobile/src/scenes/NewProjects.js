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

    this.state = {
      index: 0,
      projects: this.props.projects.filter(project =>
        !this.props.user.doNotDisplayList
        .includes(project.id))
        .sort(this.sortByID)
        .sort(this.sortByVotes),
    };

    this.swipeRight = this.swipeRight.bind(this);
    this.swipeLeft = this.swipeLeft.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.projects !== this.props.projects) {
      this.setState({
        projects: nextProps.projects
          .filter(project => !nextProps.user.doNotDisplayList.includes(project.id))
          .sort((a, b) => b.id - a.id)
          .sort((a, b) => b.votes - a.votes),
      });
    }
  }

  swipeRight() {
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
                right={() => this.deckSwiper._root.swipeRight()}
                left={() => this.deckSwiper._root.swipeLeft()}
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
