// Import Libraries
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import translate from '../translation'
// Import actions
import { logOut, sendGoogleAnalytics } from '../actions';

// Import componenets, functions, and styles
import { Button } from '../components/common';
import styles from '../styles/scenes/SettingsStyles';

class Settings extends Component {
  constructor(props) {
    super(props);
    props.sendGoogleAnalytics('Settings', props.group.groupName);
  }

  render() {
    const { container, signoutButton } = styles;
    const { language } = this.props.user
    return (
      <View style={container}>
        {/* To do: add change password option*/}

        {/* Sign-out button */}
        <View style={signoutButton}>
          <Button
            onPress={() => {
              // tracker.trackEvent('Auth', 'Logged Out', { label: this.props.group.domain });
              this.props.logOut();
              const navToAuth = NavigationActions.reset({
                index: 0,
                key: null,
                actions: [NavigationActions.navigate({ routeName: 'Auth' })],
              });
              this.props.navigation.dispatch(navToAuth);
            }}
            style={{ marginTop: 10 }}
          >
            {translate(language).SIGN_OUT}
          </Button>
        </View>
      </View>
    );
  }
}

Settings.propTypes = {
  logOut: PropTypes.func,
  navigation: PropTypes.object,
  group: PropTypes.object,
  sendGoogleAnalytics: PropTypes.func,
};

function mapStateToProps(state) {
  const { group, user} = state;
  return { group, user };
}

export default connect(mapStateToProps, { logOut, sendGoogleAnalytics })(Settings);
