// Import Libraries
import React from 'react';
import { View } from 'react-native';

// Import components and images
import { Spinner } from '../components/common';

const Loading = () => (
  <View style={{ flex: 1, backgroundColor: 'white' }}>
    <Spinner />
  </View>
);

export default Loading;
