// Import Libraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
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

  renderOfficialResponseTag() {
    const exists = Boolean(this.props.project.response);

    if (exists) {
      const responseExists = (this.props.project.response.text !== '');
      if (responseExists) {
        return (
          <View style={{flex: 1, alignItems:'center', justifyContent: 'center' }}>
            <Icon name="transcribe-close" type="material-community" color="blue" />
          </View>
        );
      }
    }
    return null;
  }

  renderStatus() {
    const { stage } = this.props.project;
    if (stage && stage === 'complete') {
      return <Icon name="done" size={35} color={'#006400'} />;
    }
    if (stage && stage === 'inprocess') {
      return <Icon name="sync" size={35} color={'#00008B'} />;
    }
    return <Icon name="fiber-new" size={35} color={'#A9A9A9'} />;
  }
  renderImage() {
    const { project } = this.props;

    if (project.imageURL && project.imageURL !== '') {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Image
            source={{ uri: project.imageURL }}
            style={{ width: 50, height: 50, borderColor: 'black', borderWidth: 0.5 }}
          />
        </View>
      );
    }
    return null;
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
          {this.renderImage()}
          <CardItem style={{justifyContent:'space-between'}}>
            <View style={{flex: 1, alignItems:'center' }}>
              <View style={{justifyContent: 'center', flexDirection: 'column' }}>
                <View style={{flexDirection:'row', justifyContent: 'flex-end'}}>
                  <Text style={[styles.smallText, { color: 'green', fontSize: 18 }]}>{project.votes}</Text>
                  <Icon size={18} name='arrow-upward' color= 'green' />
                </View>
                <View style={{flexDirection:'row', justifyContent: 'flex-end'}}>
                  <Text style={[styles.smallText, { color: 'red', fontSize: 18 }]}>{project.downvotes}</Text>
                  <Icon size={18} name='arrow-downward' color= 'red' />
                </View>
              </View>
            </View>
            <View style={{flex: 1, alignItems:'center', justifyContent:'center' }}>
              {this.renderStatus()}
            </View>
            {this.renderOfficialResponseTag()}

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
