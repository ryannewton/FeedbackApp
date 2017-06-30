// Import libraries
import React from 'react';
import { TextInput, View, Text } from 'react-native';

const Input = ({ label, keyboardType, value, onChangeText, placeholder, secureTextEntry, editable = true, maxLength }) => {
  const { inputStyle, labelStyle, containerStyle } = styles;

  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>{label}</Text>
      <TextInput
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        autoCorrect={false}
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        editable={editable}
        maxLength={maxLength}
      />
    </View>
  );
};

Input.propTypes = {
  label: React.PropTypes.string,
  value: React.PropTypes.string,
  onChangeText: React.PropTypes.func,
  placeholder: React.PropTypes.string,
  secureTextEntry: React.PropTypes.bool,
};

const styles = {
  inputStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23,
    flex: 5,
  },
  labelStyle: {
    fontSize: 18,
    paddingLeft: 0,
    flex: 1,
  },
  containerStyle: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
};

export { Input };
