'use strict';

// Import libraries
import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
	container: {
		backgroundColor: '#F7FCFF',
		flex: 1
	},
	normalMargin: {
		marginTop: 5,
		marginBottom: 5,
		marginLeft: 5
	},
	textDisplay: {
		fontWeight: 'bold',
		fontSize: 18
	},
	textInput: {
		fontSize: 18,
		...Platform.select({
			ios: {
				height: 24,
				borderBottomColor: 'gray',
				borderBottomWidth: 1
			},
			android: {
				height: 40,
			}
		})
	}
});
