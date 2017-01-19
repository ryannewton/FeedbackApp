'use strict';

import React from 'React';
import {
	Text,
	Platform,
	StyleSheet,
	TouchableNativeFeedback,
	TouchableOpacity,
	View
} from 'react-native';

export default class Button extends React.Component {

  render() {
    const {
      backgroundColor,
      textColor,
      onPress,
      text,
      disabled,
    } = this.props;
    const buttonStyles = [styles.button];
    const textStyles = [styles.text];
    const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;
    if (textColor) {
    	textStyles.push({color: textColor});
    }
    if (backgroundColor) {
    	buttonStyles.push({backgroundColor});
    }
    if (disabled) {
      buttonStyles.push(styles.buttonDisabled);
      textStyles.push(styles.textDisabled);
    }

    const formattedTitle = text.toUpperCase();

    return (
      <Touchable
        disabled={disabled}
        onPress={onPress}>
        <View style={buttonStyles}>
          <Text style={textStyles}>{formattedTitle}</Text>
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  button: Platform.select({
    ios: {
    	backgroundColor: '#2196F3',
    	borderRadius: 2,
    },
    android: {
      elevation: 4,
      backgroundColor: '#2196F3',
      borderRadius: 2,
    },
  }),
  text: Platform.select({
    ios: {
      textAlign: 'center',
      color: 'white',      
      padding: 8,
      fontWeight: '500',
    },
    android: {
      textAlign: 'center',
      color: 'white',
      padding: 8,
      fontWeight: '500',
    },
  }),
  buttonDisabled: Platform.select({
    ios: {
    	backgroundColor: '#dfdfdf',
    },
    android: {
      elevation: 0,
      backgroundColor: '#dfdfdf',
    }
  }),
  textDisabled: Platform.select({
    ios: {
      color: '#a1a1a1',
    },
    android: {
      color: '#a1a1a1',
    }
  }),
});