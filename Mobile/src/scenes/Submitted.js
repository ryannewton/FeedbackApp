// Import Libraries
import React, { Component } from 'react';
import { Text, View, Keyboard, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';

// Import components, functions, and styles
import { Button } from '../components/common';
import styles from '../styles/scenes/SubmittedStyles';

// Import tracking
import { sendGoogleAnalytics } from '../actions';

import check from '../../images/icons/check.png';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class Submitted extends Component {
  constructor(props) {
    super(props);
    props.sendGoogleAnalytics('Submitted');
  }

  componentWillMount() {
    Keyboard.dismiss();
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
          <Image source={check} resizeMode="contain" style={{ width: SCREEN_WIDTH/3, height: SCREEN_WIDTH/3 }} />
            {/* To do: To do: Update navigation to use react-navigation */}
          <Text style={{ fontSize: 18 }}> Thanks for submitting feedback! </Text>
          <View style={{ width: SCREEN_WIDTH/2 }}>
            <Button onPress={() => this.props.navigation.navigate('Main')}>
              Back to Board
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
  const { group } = state;
  return { group };
}

export default connect(mapStateToProps, { sendGoogleAnalytics })(Submitted);
