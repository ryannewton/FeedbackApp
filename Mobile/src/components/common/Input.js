// Import libraries
import React from 'react';
import { TextInput, View, Text } from 'react-native';
import PropTypes from 'prop-types';

const Input = (
  {
    label,
    keyboardType,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    editable = true,
    maxLength }) => {
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
  label: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  placeholder: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  keyboardType: PropTypes.string,
  editable: PropTypes.bool,
  maxLength: PropTypes.number,
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
