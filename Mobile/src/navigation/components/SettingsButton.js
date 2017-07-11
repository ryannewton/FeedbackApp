// Import Libraries
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

class SettingsButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{ width: 50 }}
        onPress={() => this.props.navigation.navigate('Settings')}
      >
        <Icon name="settings" size={25} color="white" />
      </TouchableOpacity>
    );
  }
}

export default SettingsButton;
