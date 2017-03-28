// Import Libraries
import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Icon, DeckSwiper, Card, CardItem, Left, Text } from 'native-base';
import { connect } from 'react-redux';
//import { Icon } from 'react-native-elements';

// Import Components
import RequireData from '../components/RequireData';

// Import actions and styles
import { addProjectUpvote, addToDoNotDisplayList } from '../actions';
import styles from '../styles/styles_main';

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

  renderCard(project) {
    return (
      <View style={styles.container}>
        <Card style={{ elevation: 3, marginHorizontal: 8, height: 300 }}>
          <CardItem>
            <Left>
              <Text>{project.title}</Text>
            </Left>
          </CardItem>
          <CardItem cardBody style={{ paddingHorizontal: 8 }}>
            <Text>{project.description}</Text>
          </CardItem>
          <CardItem>
            <Icon name="heart" style={{ color: '#ED4A6A' }} />
            <Text>{project.votes}</Text>
          </CardItem>
        </Card>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', margin: 10 }}>
            <Icon name="arrow-back" size={25} />
            <Text>  Skip</Text>
          </View>
          <View style={{ flexDirection: 'row', margin: 10 }}>
            <Text>Upvote  </Text>
            <Icon name="arrow-forward" size={25} />
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <Container>
        <View style={[styles.container, styles.swiper]}>
          <DeckSwiper
            dataSource={this.state.projects}
            onSwipeRight={this.swipeRight}
            onSwipeLeft={this.swipeLeft}
            renderItem={project => this.renderCard(project)}
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
