// Import Libraries
import React, { Component } from 'react';
import { Text, View, Keyboard, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';

// Import components, functions, and styles
import { Button } from '../components/common';
import styles from '../styles/scenes/SubmittedStyles';
import translate from '../translation';

// Import tracking
import { sendGoogleAnalytics } from '../actions';

import check from '../../images/icons/check.png';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class Submitted extends Component {
  constructor(props) {
    super(props);
    props.sendGoogleAnalytics('Submitted', props.group.groupName);
  }

  componentWillMount() {
    Keyboard.dismiss();
  }

  renderSubmittedText() {
    if (!this.props.group.feedbackRequireApproval) {
      return translate(this.props.user.language).THANKS_FOR_FEEDBACK;
    }
    return (
      <Text>
        Your feedback is
        <Text style={{fontWeight: "bold", fontSize: 25}}> pending </Text>
        approval.
        {"\n"}
        {"\n"}
        (A moderator reviews all feedback)
      </Text>
    );
  }

  render() {
    const navToFeedbackList = NavigationActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'Main' })],
    });
    return (
      <View style={styles.container, { flex:1, flexDirection:'column', backgroundColor:'white'}}>
        <View style={{ flex:2 }}>
        </View>
        <View style={styles.container, { flex:4, flexDirection:'column', alignItems:'center', justifyContent:'space-around'}}>
            {/* To do: To do: Update navigation to use react-navigation */}
          <Image source={check} resizeMode="contain" style={{ width: SCREEN_WIDTH/3, height: SCREEN_WIDTH/3 }} />
          <Text style={{ 
              fontSize: 18, 
              textAlign: 'center' 
            }}
          > 
            {this.renderSubmittedText()} 
          </Text>
          <View style={{ width: SCREEN_WIDTH/2 }}>
            <Button onPress={() => this.props.navigation.navigate('Main')}>
              {translate(this.props.user.language).BACK_TO_BOARD}
            </Button>
          </View>
        </View>
        <View style={{flex:3}}>
        </View>
      </View>
    );
  }
}

Submitted.propTypes = {
  navigation: PropTypes.object,
  group: PropTypes.object,
  sendGoogleAnalytics: PropTypes.func,
};

function mapStateToProps(state) {
  const { group, user } = state;
  return { group, user };
}

export default connect(mapStateToProps, { sendGoogleAnalytics })(Submitted);
