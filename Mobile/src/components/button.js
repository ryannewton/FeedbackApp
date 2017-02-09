'use strict';

// Import libraries
import React, { Component } from 'react';
import { Text, Platform, TouchableNativeFeedback, TouchableOpacity,	View } from 'react-native';

//Import components, functions, and styles
import styles from '../styles/button_styles';

export default class Button extends Component {

	render() {
		const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;
		const { onPress, text, disabled, style } = this.props;
		const { buttonStyles, textStyles } = updateStylesFromProps(this.props);
		const formattedTitle = text.toUpperCase();

		return (
			<Touchable disabled={disabled} onPress={onPress}>
				<View style={[buttonStyles, style]}>
					<Text style={textStyles}>{formattedTitle}</Text>
				</View>
			</Touchable>
		);
	}
}

// Adds styling passed in as props
function updateStylesFromProps(props) {
	const { backgroundColor, textColor, disabled } = props;
	const { buttonStyles, textStyles, buttonDisabled, textDisabled } = styles;

	if (textColor) {
		textStyles.push({ color: textColor });
	}
	if (backgroundColor) {
		buttonStyles.push({ backgroundColor });
	}
	if (disabled) {
		buttonStyles.push(buttonDisabled);
		textStyles.push(textDisabled);
	}

	return styles;
}
