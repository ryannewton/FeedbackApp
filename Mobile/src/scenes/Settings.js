// Import Libraries
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

// Import actions
import { logOut } from '../actions';

// Import componenets, functions, and styles
import { Button } from '../components/common';
import styles from '../styles/scenes/SettingsStyles';

// Import tracking
// import { tracker } from '../constants';

class Settings extends Component {
  constructor(props) {
    super(props);

    // tracker.trackScreenViewWithCustomDimensionValues('Settings', { domain: props.group.domain });
  }

  render() {
    const { container, signoutButton } = styles;

    return (
      <View style={container}>
        {/* To do: add change password option*/}

        {/* Sign-out button */}
        <View style={signoutButton}>
          <Button
            onPress={() => {
              // tracker.trackEvent('Auth', 'Logged Out', { label: this.props.group.domain });
              this.props.logOut();
              this.props.navigation.navigate('Auth');
            }}
            style={{ marginTop: 10 }}
          >
            Sign Out
          </Button>
        </View>
      </View>
    );
  }
}

Settings.propTypes = {
  logOut: React.PropTypes.func,
  navigation: React.PropTypes.object,
  group: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { group } = state;
  return { group };
}

export default connect(mapStateToProps, { logOut })(Settings);
