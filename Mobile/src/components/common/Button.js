import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

const Button = ({ onPress, children, style, textStyle }) => (
  <View style={[{ flexDirection: 'row' }]}>
    <TouchableOpacity onPress={onPress} style={[defaultStyles.buttonStyle, style]}>
      <Text style={[defaultStyles.textStyle, textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  </View>
);

Button.propTypes = {
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
    alignSelf: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#00A2FF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00A2FF',
    marginLeft: 5,
    marginRight: 5,
    height: 40,
  },
};

export { Button };
