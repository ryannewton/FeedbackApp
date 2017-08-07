// Import Libraries
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';

class SettingsButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{ width: 50 }}
        onPress={() => this.props.navigation.navigate('Settings', this.props.translation.SETTINGS)}
      >
        <Icon name="settings" size={25} color="white" />
      </TouchableOpacity>
    );
  }
}
function mapStateToProps(state) {
  const { translation } = state;
  return { translation };
}
export default connect(mapStateToProps)(SettingsButton);
