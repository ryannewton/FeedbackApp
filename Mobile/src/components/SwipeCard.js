// Import Libraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, CardItem, Left } from 'native-base';
import { Icon } from 'react-native-elements';

// Import actions and styles
import styles from '../styles/components/SwipeCardStyles';

// Import tracking
// import { tracker } from '../constants';

class SwipeCard extends Component {
  // constructor(props) {
  //   super(props);
  //   tracker.trackEvent('View', 'Swipe Card', { label: props.group.domain, value: props.feedback.id });
  // }

  render() {
    const { feedback } = this.props;
    return (
      <Card style={styles.card}>
        <View>
          <CardItem>
            <Text style={styles.bodyText}>{feedback.text}</Text>
          </CardItem>
          <CardItem>
            <View style={{flexDirection:'row', justifyContent: 'flex-end'}}>
              <Text style={[styles.smallText, { color: '#48D2A0', fontSize: 18 }]}>{feedback.upvotes}</Text>
              <Icon size={18} name='arrow-upward' color= '#48D2A0' />
            </View>
            <View style={{flexDirection:'row', justifyContent: 'flex-start'}}>
              <Text style={[styles.smallText, { color: '#F54B5E', fontSize: 18 }]}>{feedback.downvotes}</Text>
              <Icon size={18} name='arrow-downward' color= '#F54B5E' />
            </View>
          </CardItem>
        </View>
        <View style={{ justifyContent: 'flex-end' }}>
          <CardItem style={{ justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={this.props.left} style={styles.cardButton}>
              <Icon
                name="thumb-down"
                size={50}
                color={'grey'}
              />
              <Text>Disagree</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (this.props.feedback.id) {
                  // tracker.trackEvent('View', 'Feedback Details Via Swipe Card', {
                  //   label: this.props.group.domain,
                  //   value: this.props.feedback.id,
                  // });
                  this.props.navigate('Details', { feedback: this.props.feedback });
                }
              }}
              style={styles.cardButton}
            >
              <Icon name="comment" size={40} color={'grey'} />
              <Text style={{ fontSize: 16 }}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.props.skip} style={styles.cardButton}>
              <Icon
                name="skip-next"
                size={40}
                color={'grey'}
              />
              <Text style={{ fontSize: 16 }}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.props.right} style={styles.cardButton}>
              <Icon
                name="thumb-up"
                size={50}
                color={'grey'}
              />
              <Text>Agree</Text>
            </TouchableOpacity>
          </CardItem>
        </View>
      </Card>
    );
  }
}

SwipeCard.propTypes = {
  feedback: React.PropTypes.object,
  navigate: React.PropTypes.func,
  left: React.PropTypes.func,
  right: React.PropTypes.func,
  group: React.PropTypes.object,
  skip: React.PropTypes.func,
};

export default SwipeCard;
