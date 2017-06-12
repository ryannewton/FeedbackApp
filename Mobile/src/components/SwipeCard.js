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
  constructor(props) {
    super(props);
    // tracker.trackEvent('View', 'Swipe Card', { label: props.features.domain, value: props.project.id });
  }

  _changeStyle() {

  }

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
          <CardItem style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <Text style={[styles.smallText, { color: 'green' }]}>{project.votes}</Text>
            <Icon size={18} name='arrow-upward' color= 'green' />
            <View style={{ paddingRight: 5, paddingLeft: 5}}>
              <Text style={{fontWeight: '400', fontSize: 18}}>|</Text>
            </View>
            <Text style={[styles.smallText, { color: 'red' }]}>{project.downvotes}</Text>
            <Icon size={18} name='arrow-downward' color= 'red' />
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
                if (this.props.project.id) {
                  // tracker.trackEvent('View', 'Project Details Via Swipe Card', {
                  //   label: this.props.features.domain,
                  //   value: this.props.project.id,
                  // });
                  this.props.navigate('Details', { project: this.props.project });
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
  project: React.PropTypes.object,
  navigate: React.PropTypes.func,
  left: React.PropTypes.func,
  right: React.PropTypes.func,
  features: React.PropTypes.object,
  skip: React.PropTypes.func,
};

export default SwipeCard;
