import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

const TinyButton = ({ onPress, children, style, textStyle }) => (
  <View style={[defaultStyles.buttonStyle, style]}>
      <Text style={[defaultStyles.textStyle, textStyle]}>
        {children}
      </Text>
  </View>
);

TinyButton.propTypes = {
  onPress: PropTypes.func,
  children: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
  textStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
};

const defaultStyles = {
  textStyle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#F8C61C',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#F8C61C',
    marginLeft: 5,
    marginRight: 5,
    height: 30,
    width: 65,
    shadowColor: "#000000",
    shadowOpacity: 0.4,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 1,
    }
  },
};

export { TinyButton };
