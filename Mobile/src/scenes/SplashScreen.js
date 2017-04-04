// Import Libraries
import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

// Import components and images
import { Spinner } from '../components/common';
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
      <View style={{ flex: 1 }}>
        <Image source={fullScreen} />
      </View>
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
