// Import libraries
import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const Spinner = ({ size, style }) => (
  <View style={[defaultStyles.spinnerStyle, style]}>
    <ActivityIndicator size={size || 'large'} />
  </View>
);

Spinner.propTypes = {
  size: React.PropTypes.string,
  style: React.PropTypes.object,
};

const defaultStyles = {
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export { Spinner };
