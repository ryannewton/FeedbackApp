// Import Libraries
import React, { Component } from 'react';
import { Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

// Import image and styles
import styles from '../styles/scenes/SplashScreenStyles';
import fullScreen from '../../images/backgrounds/SplashScreen.png';

class SplashScreen extends Component {
  componentWillMount() {
    this.route();
  }

  componentDidUpdate() {
    this.route();
  }

  route() {
    // Reroute if the saved state has loaded
    if (!this.props.auth.loadingState && this.props.auth.loggedIn !== null) {
      // Route to main if logged in
      if (this.props.auth.loggedIn) {
        this.navigateTo('Tabs', 'NewProjects');
      } else {
        this.navigateTo('Auth');
      }
    }
  }

  navigateTo(routeName, subRouteName) {
    const navigateAction = NavigationActions.navigate({
      routeName,
      params: {},
      action: NavigationActions.navigate({ routeName: subRouteName }),
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    return (
      <Image style={styles.background} source={fullScreen} resizeMode="cover">
        <Text style={styles.text}>COLLABORATIVE FEEDBACK</Text>
      </Image>
    );
  }
}

SplashScreen.propTypes = {
  auth: React.PropTypes.object,
  navigation: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

export default connect(mapStateToProps)(SplashScreen);
