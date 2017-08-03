import React from 'react';
import { Text } from 'react-native';

const CustomText = ({ children, style, numberOfLines}) => (
  <Text style={style} numberOfLines={numberOfLines} allowFontScaling={false}>
    {children}
  </Text>
);

export { CustomText };
