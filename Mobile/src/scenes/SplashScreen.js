// Import Libraries
import React, { Component } from 'react';
import { Text, Image } from 'react-native';
import { connect } from 'react-redux';

// Import image and styles
import { Spinner } from '../components/common';
import styles from '../styles/scenes/SplashScreenStyles';
import fullScreen from '../../images/backgrounds/SplashScreen.png';

// Import tracking
// import { tracker } from '../constants';
import { sendGoogleAnalytics } from '../actions';

class SplashScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cleared: false,
    };

    this.route = this.route.bind(this);

    // tracker.trackScreenView('Loading Screen');
    this.props.sendGoogleAnalytics('LoadingScreen')
  }

  componentDidUpdate() {
    if (this.state.cleared === false) {
      this.route();
    }
  }

  route() {
    // There are two options where we want to naviagte
    // 1) loggedIn is false meaning that we failed to login
    if (this.props.auth.loggedIn === false) {
      this.props.navigation.navigate('Welcome');
      this.setState({ cleared: true });
    // 2) loggedIn is true (we logged in) and we have stored all the data we need in state
    } else if (
        this.props.auth.loggedIn === true &&
        this.props.feedback.lastPulled.getTime() !== 0
      ) {
      // tracker.setUser(this.props.group.email);
      this.props.navigation.navigate('FeedbackSwipe');
      this.setState({ cleared: true });
    }
    // Otherwise we wait until we receive a response and one of these two conditions becomes true
  }

  render() {
    return (
      <Image style={styles.background} source={fullScreen} resizeMode="cover">
        <Spinner size="large" style={{ marginTop: 200 }} />
        <Text style={styles.text}>SUGGESTION BOX</Text>
      </Image>
    );
  }
}

SplashScreen.propTypes = {
  auth: React.PropTypes.object,
  navigation: React.PropTypes.object,
  group: React.PropTypes.object,
  feedback: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { auth, group, feedback } = state;
  return { auth, group, feedback };
}

export default connect(mapStateToProps, { sendGoogleAnalytics })(SplashScreen);
