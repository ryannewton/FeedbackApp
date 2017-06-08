// Import Libraries
import React, { Component } from 'react';
import { Text, Image } from 'react-native';
import { connect } from 'react-redux';

// Import image and styles
import { Spinner } from '../components/common';
import styles from '../styles/scenes/SplashScreenStyles';
import fullScreen from '../../images/backgrounds/SplashScreen.png';

// Import tracking
import { tracker } from '../constants';

class SplashScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cleared: false,
    };

    this.route = this.route.bind(this);

    tracker.trackScreenView('Loading Screen');
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
      this.props.navigation.navigate('SubmitEmail');
      this.setState({ cleared: true });
    // 2) loggedIn is true (we logged in) and we have stored all the data we need in state
    //    - We need projects and enableNewFeedback
    } else if (
        this.props.auth.loggedIn === true &&
        this.props.projects.lastPulled.getTime() !== 0 &&
        this.props.features.enableNewFeedback !== null
      ) {
      tracker.setUser(this.props.features.email);
      // If enableNewFeedback is true then we navigate to new projects as normal
      if (this.props.features.enableNewFeedback) {
        this.props.navigation.navigate('FeedbackSwipe');
      // If not, then we navigate to Feedback and disable the New Projects tab
      } else {
        this.props.navigation.navigate('FeedbackSubmit');
      }
      this.setState({ cleared: true });
    }
    // Otherwise we wait until we receive a response and one of these two conditions becomes true
  }

  render() {
    return (
      <Image style={styles.background} source={fullScreen} resizeMode="cover">
        <Spinner size="large" style={{ marginTop: 200 }} />
        <Text style={styles.text}>COLLABORATIVE FEEDBACK</Text>
      </Image>
    );
  }
}

SplashScreen.propTypes = {
  auth: React.PropTypes.object,
  navigation: React.PropTypes.object,
  features: React.PropTypes.object,
  projects: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { auth, projects, features } = state;
  return { auth, features, projects };
}

export default connect(mapStateToProps)(SplashScreen);
