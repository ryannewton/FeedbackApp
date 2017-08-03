import React from 'react';
import { Text } from 'react-native';

const CustomText = ({ children, style, numberOfLines}) => (
  <Text style={style} numberOfLines={numberOfLines} accessible={false} allowFontScaling={false}>
    {children}
  </Text>
);

export { CustomText };