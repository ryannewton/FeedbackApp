// Import Libraries
import React, { Component } from 'react';
import { View, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

// Import actions
import { logOut } from '../actions';

// Import componenets, functions, and styles
import { Button } from '../components/common';
import styles from '../styles/settings_styles';

class Settings extends Component {

  navigateTo(routeName, subRouteName) {
    const navigateAction = NavigationActions.navigate({
      routeName,
      params: {},
      action: NavigationActions.navigate({ routeName: subRouteName }),
    });
    this.props.navigation.dispatch(navigateAction);
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
              this.props.logOut();
              this.navigateTo('Auth');
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
  auth: React.PropTypes.object,
  logOut: React.PropTypes.func,
  navigation: React.PropTypes.object,
};

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, { logOut })(Settings);
