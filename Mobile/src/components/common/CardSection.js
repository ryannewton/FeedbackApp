import React from 'react';
import { View } from 'react-native';

const CardSection = props => {
  return (
    <View style={styles.containerStyle}>
      {props.children}
    </View>
  );
};

CardSection.propTypes = {
  children: React.PropTypes.object,
};

const styles = {
  containerStyle: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative',
  },
};

export { CardSection };
