// Import Libraries
import React, { Component } from 'react';
import { View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

// Import actions
import { logOut } from '../actions';

// Import componenets, functions, and styles
import { Button } from '../components/common';
import styles from '../styles/settings_styles';

class Settings extends Component {
  componentWillMount() {
    this.setState({ email: this.props.auth.email });
  }

  render() {
    const { container } = styles;

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={container}>
          {/* To do: add change password option*/}

          {/* Sign-out button */}
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
            <Button
              onPress={() => {
                this.props.logOut();
                Keyboard.dismiss();
              }}
              style={{ marginTop: 10 }}
            >
              Sign Out
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

Settings.propTypes = {
  auth: React.PropTypes.object,
  logOut: React.PropTypes.func,
};

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, { logOut })(Settings);
