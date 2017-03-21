// Import Libraries
import React from 'react';
import { View, Image } from 'react-native';

// Import components and images
import { Spinner } from '../components/common';
import logo from '../../images/icons/icon120.png';

const Welcome = () => (
  <View style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
      <Image source={logo} />
    </View>
    <Spinner />
  </View>
);

export default Welcome;
