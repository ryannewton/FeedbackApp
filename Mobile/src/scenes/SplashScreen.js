// Import Libraries
import React, { Component } from 'react';
import { Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

// Import image and styles
import { Spinner } from '../components/common';
import styles from '../styles/scenes/SplashScreenStyles';
import fullScreen from '../../images/backgrounds/SplashScreen.png';

class SplashScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cleared: false,
    };

    this.route = this.route.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
  }

  componentDidUpdate() {
    if (this.state.cleared === false) {
      this.route();
    }
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

      this.setState({ cleared: true });
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
        <Spinner size='large' style={{ marginTop: 200 }} />
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
