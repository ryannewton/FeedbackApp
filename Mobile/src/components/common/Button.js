'use strict';

import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

const Button = ({ onPress, children, style, textStyle }) => {
	return (
		<View style={[{ flexDirection: 'row' }]}>
			<TouchableOpacity onPress={onPress} style={[defaultStyles.buttonStyle, style]}>
				<Text style={[defaultStyles.textStyle, textStyle]}>
					{children}
				</Text>
			</TouchableOpacity>
		</View>
	);
};

const defaultStyles = {
	textStyle: {
		alignSelf: 'center',
		color: '#007aff',
		fontSize: 16,
		fontWeight: '600'
	},
	buttonStyle: {
		flex: 1,
		alignSelf: 'stretch',
		justifyContent: 'center',
		backgroundColor: '#fff',
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#007aff',
		marginLeft: 5,
		marginRight: 5,
		height: 40
	}
};

export { Button };
