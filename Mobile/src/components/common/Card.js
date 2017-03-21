import React from 'react';
import { View, Platform } from 'react-native';

const Card = props => (
  <View style={styles.containerStyle}>
    {props.children}
  </View>
);

Card.propTypes = {
  children: React.PropTypes.object,
};

const styles = {
  containerStyle: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    elevation: 1,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
};

export { Card };
