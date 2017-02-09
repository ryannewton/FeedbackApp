'use strict';

import React from 'react';
import { Text, View, Platform } from 'react-native';

const Header = ({ children }) => {
	const { textStyle, viewStyle } = styles;

	return (
		<View style={{ flexDirection: 'row' }}>
			<View style={viewStyle}>
				<Text style={textStyle}>{children}</Text>
			</View>
		</View>
	);
};

const styles = {
	viewStyle: {
		flex: 1,
		backgroundColor: '#F7FCFF',
		justifyContent: 'center',
		alignItems: 'center',
		height: 50,
		elevation: 3,
		position: 'relative',
		...Platform.select({
			ios: {
				paddingTop: 15
			}
		})
	},
	textStyle: {
		fontSize: 20
	}
};

export { Header };
