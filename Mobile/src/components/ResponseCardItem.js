import React from 'react';
import { View, Text } from 'react-native';

import { CardSection } from '../components/common';

const ResponseCardItem = ({ text, author }) => {
  // Requires a text and author prop given to it!
  const { responseStyle, authorStyle, containerStyle } = styles;
  return (
    <CardSection>
      <View style={containerStyle}>
        <Text style={responseStyle}>
          {text}
        </Text>
        <View style={authorStyle}>
          <Text>-{author}</Text>
        </View>
      </View>
    </CardSection>
  );
};

const styles = {
  responseStyle: {
    fontSize: 18,
    color: '#444444',
    fontWeight: 'bold',
  },
  authorStyle: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  containerStyle: {
    justifyContent: 'flex-start',
    flex: 1,
  },
};

export default ResponseCardItem;
