// Import libraries
import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const Spinner = ({ size, style }) => {
  return (
    <View style={[defaultStyles.spinnerStyle, style]}>
      <ActivityIndicator size={size || 'large'} />
    </View>
  );
};

const defaultStyles = {
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export { Spinner };
