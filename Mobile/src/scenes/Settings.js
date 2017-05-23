// Import Libraries
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

// Import actions
import { logOut } from '../actions';

// Import componenets, functions, and styles
import { Button } from '../components/common';
import styles from '../styles/settings_styles';

// Import tracking
import { tracker } from '../constants';

class Settings extends Component {
  constructor(props) {
    super(props);

    tracker.trackScreenViewWithCustomDimensionValues('Settings', { domain: props.features.domain });
  }

  render() {
    const { container } = styles;

    return (
      <View style={container}>
        {/* To do: add change password option*/}

        {/* Sign-out button */}
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
          <Button
            onPress={() => {
              tracker.trackEvent('Auth', 'Logged Out', { label: this.props.features.domain });
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
  features: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { features } = state;
  return { features };
}

export default connect(mapStateToProps, { logOut })(Settings);
