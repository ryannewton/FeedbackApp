// Import Libraries
import React, { Component } from 'react';
import { Text, View, Keyboard, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Import components, functions, and styles
import { Button } from '../components/common';
import styles from '../styles/scenes/SubmittedStyles';
import translate from '../translation';

// Import tracking
import { sendGoogleAnalytics } from '../actions';

import check from '../../images/icons/check.png';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Submitted extends Component {
  constructor(props) {
    super(props);
    props.sendGoogleAnalytics('Submitted', props.group.groupName);
  }

  componentWillMount() {
    Keyboard.dismiss();
  }

  renderSubmittedText() {
    if (!this.props.group.feedbackRequiresApproval) {
      return translate(this.props.user.language).THANKS_FOR_FEEDBACK;
    }
    return (
      <Text>
        Your feedback is
        <Text style={{ fontWeight: 'bold', fontSize: 22 }}> pending </Text>
        approval.
        {'\n'}
        (A moderator reviews all feedback)
      </Text>
    );
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: 'white' }]}>
        <View style={{ flex: 2 }} />
        <View style={[styles.container, { flex: 4, alignItems: 'center', justifyContent: 'space-around' }]}>
          <Image
            source={check}
            resizeMode="contain"
            style={{ width: SCREEN_WIDTH / 3, height: SCREEN_WIDTH / 3 }}
          />
          <Text style={{ fontSize: 18, textAlign: 'center' }}>
            {this.renderSubmittedText()}
          </Text>
          <View style={{ width: SCREEN_WIDTH / 2 }}>
            <Button onPress={() => this.props.navigation.navigate('Main')}>
              {translate(this.props.user.language).BACK_TO_BOARD}
            </Button>
          </View>
        </View>
        <View style={{ flex: 3 }} />
      </View>
    );
  }
}

Submitted.propTypes = {
  navigation: PropTypes.object,
  group: PropTypes.object,
  sendGoogleAnalytics: PropTypes.func,
  user: PropTypes.object,
};

function mapStateToProps(state) {
  const { group, user } = state;
  return { group, user };
}

export default connect(mapStateToProps, { sendGoogleAnalytics })(Submitted);
