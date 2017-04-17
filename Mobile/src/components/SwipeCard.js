// Import Libraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, CardItem, Left } from 'native-base';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';

// Import actions and styles
import styles from '../styles/components/SwipeCardStyles';

class SwipeCard extends Component {

  render() {
    const { project } = this.props;
    return (
      <Card style={styles.card}>
        <View>
          <CardItem>
            <Left>
              <Text style={styles.bodyText}>{project.title}</Text>
            </Left>
          </CardItem>
          <CardItem>
            <Text style={styles.smallText}>{project.votes} upvotes</Text>
          </CardItem>
        </View>
        <View style={{ justifyContent: 'flex-end' }}>
          <CardItem style={{ justifyContent: 'space-between' }} >
            <TouchableOpacity onPress={this.props.left}>
              <Icon name="skip-next" size={50} color={'#A41034'} />
              <Text>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigate('Details', { project: this.props.project })}>
              <Icon name="comment" size={50} color={'#b6001e'} />
              <Text>Solutions</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.props.right}>
              <Icon name="thumb-up" size={50} color={'#A41034'} />
              <Text>Upvote</Text>
            </TouchableOpacity>
          </CardItem>
        </View>
      </Card>
    );
  }
}

SwipeCard.propTypes = {
  project: React.PropTypes.object,
  user: React.PropTypes.object,
  navigate: React.PropTypes.func,
  left: React.PropTypes.func,
  right: React.PropTypes.func,
};

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}

export default connect(mapStateToProps)(SwipeCard);
