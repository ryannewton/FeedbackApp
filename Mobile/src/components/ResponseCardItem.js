import React from 'react';
import { View, Text } from 'react-native';

import { ResponseCardSection } from '../components/common';
import styles from '../styles/components/SolutionStyles';

const ResponseCardItem = ({ text, author }) => {
  // Requires a text and author prop given to it
  const { solutionText } = styles;

  return (
    <ResponseCardSection>
      <View style={{ justifyContent: 'flex-start', flex: 1 }}>
        <Text style={[solutionText, { fontWeight: 'bold' }]}>
          {text}
        </Text>
        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <Text>-{author}</Text>
        </View>
      </View>
    </ResponseCardSection>
  );
};


export default ResponseCardItem;
