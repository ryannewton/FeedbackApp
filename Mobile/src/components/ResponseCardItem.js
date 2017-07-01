// Import Libraries
import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

// Import components and styles
import { CardSection } from '../components/common';
import styles from '../styles/components/ResponseCardItemStyles';

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

ResponseCardItem.propTypes = {
  text: PropTypes.string,
  author: PropTypes.string,
};


export default ResponseCardItem;
