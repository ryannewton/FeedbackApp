import React from 'react';
import { View } from 'react-native';

const ResponseCardSection = props => {
  return (
    <View style={styles.containerStyle}>
      {props.children}
    </View>
  );
};

ResponseCardSection.propTypes = {
  children: React.PropTypes.node,
};

const styles = {
  containerStyle: {
    borderBottomWidth: 1,
    padding: 5,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    backgroundColor: '#fff',
    position: 'relative',
  },
};

export { ResponseCardSection };
