import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

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
  onPress: React.PropTypes.func,
  children: React.PropTypes.string,
  style: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.number,
  ]),
  textStyle: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.number,
  ]),
};

const defaultStyles = {
  textStyle: {
    alignSelf: 'center',
    color: '#A41034',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#A41034',
    marginLeft: 5,
    marginRight: 5,
    height: 40,
  },
};

export { Button };
