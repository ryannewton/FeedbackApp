// Import Libraries
import React, { Component } from 'react';
import { Text, Image, Linking, Platform, Alert } from 'react-native';
import { connect } from 'react-redux';
import Expo from 'expo';
import axios from 'axios';

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

  componentDidMount() {
    if (Platform.OS === 'ios') {
      axios.get('http://itunes.apple.com/lookup?bundleId=com.feedbackapp.feedbackapp', { method: 'GET' })
        .then(response => this.forceUpdate(response));
    } else {
      axios.request('https://play.google.com/store/apps/details?id=com.feedbackapp', { method: 'GET' })
        .then(response => this.forceUpdate(response));
    }
  }
  componentDidUpdate() {
    if (this.state.cleared === false) {
      this.route();
    }
  }

  forceUpdate(response) {
    const currentVersion = String(Expo.Constants.manifest.version).split('.')[1];
    // Check if number after the first decimal place is the same as our current version's
    if (Platform.OS === 'ios' && String(response.data.results[0].version).split('.')[1] !== currentVersion) {
      return this.updateAlert('https://itunes.apple.com/us/app/collaborative-feedback-app/id1183559556e');
    } else if (Platform.OS === 'android') {
      // Scrape android webpage for the current version
      // 'itemprop="softwareVersion">' is a unique string in the html that always comes before the version
      const versionStart = response.data.search('itemprop="softwareVersion">') + 28;
      const versionEnd = versionStart + 5;
      // The '5' and '28' are a product of the scraping process to isolate the version
      const version = String(response.data.substring(versionStart, versionEnd)).split('.')[1];
      if (currentVersion !== version) {
        return this.updateAlert('https://play.google.com/store/apps/details?id=com.feedbackapp');
      }
    }
    return null;
  }

  updateAlert(url) {
    return (
      Alert.alert(
        'New version available!',
        'We are constantly updating to help you voice your ideas.\n\n\nNote: Running older versions may affect your ability to use the application.',
        [
          { text: 'Cancel' },
          { text: 'Update!', onPress: () => Linking.openURL(url) },

        ],
        { cancelable: true },
      )
    );
  }

  route() {
    // There are two options where we want to naviagte
    // 1) loggedIn is false meaning that we failed to login
    if (this.props.auth.loggedIn === false) {
      this.props.navigation.navigate('SubmitEmail');
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
