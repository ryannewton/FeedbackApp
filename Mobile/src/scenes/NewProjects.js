// Import Libraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Container, DeckSwiper } from 'native-base';
import { connect } from 'react-redux';

// Import Components
import SwipeCard from '../components/SwipeCard';
import RequireData from '../components/RequireData';

// Import actions and styles
import { addProjectUpvote, addToDoNotDisplayList, closeInstructions } from '../actions';
import styles from '../styles/scenes/NewProjectsStyles';

class NewProjects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      projects: props.projects.filter(project =>
        !props.user.doNotDisplayList
        .includes(project.id)),
    };

    this.swipeRight = this.swipeRight.bind(this);
    this.swipeLeft = this.swipeLeft.bind(this);
    this.closeInstructions = this.closeInstructions.bind(this);
  }

  swipeRight() {
    const { user } = this.props;
    const project = this.state.projects[this.state.index];

    // If user hasn't upvoted this project, add an upvote
    if (!user.projectUpvotes.includes(project.id)) {
      this.props.addProjectUpvote(project);
    }
    this.props.addToDoNotDisplayList(project.id);

    if (this.state.index === this.state.projects.length - 1) {
      this.setState({ index: 0, projects: [] });
    } else {
      this.setState({ index: this.state.index + 1 });
    }
  }

  swipeLeft() {
    const project = this.state.projects[this.state.index];
    this.props.addToDoNotDisplayList(project.id);

    if (this.state.index === this.state.projects.length - 1) {
      this.setState({ index: 0, projects: [] });
    } else {
      this.setState({ index: this.state.index + 1 });
    }
  }

  closeInstructions() {
    this.props.closeInstructions('New Projects Scene');
  }

  render() {
    const instructionsScreen = (
      <TouchableOpacity onPress={this.closeInstructions}>
        <Text>Image Here</Text>
      </TouchableOpacity>
    );

    const newProjectsScene = (      
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
            navigate={this.props.navigation.navigate}
          />
        }
      />      
    );

    // const screenToShow = (!this.props.user.instructionsViewed.includes('New Projects Scene')) ? instructionsScreen : newProjectsScene;
    const screenToShow = newProjectsScene;

    return (
      <Container>
        <View style={[styles.container, styles.swiper]}>
          {screenToShow}
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
  closeInstructions,
})(RequireData(NewProjects));
