'use strict';

const ReactNative = require('react-native');

const {
	StyleSheet,
} = ReactNative;

const styles = StyleSheet.create({
	navigator: {
		flex: 1,
	},
	navigatorCardStack: {
		flex: 20,
	},
	tabs: {
		flex: 1,
		flexDirection: 'row',
		height: 100
	},
	tab: {
		alignItems: 'center',
		backgroundColor: '#fff',
		flex: 1,
		justifyContent: 'center',
	},
	tabText: {
		color: '#222',
		fontWeight: '500',
	},
	tabSelected: {
		color: 'blue',
	},
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 18,
		textAlign: 'center',
		margin: 10,
	},
	feedback_input: {
		height: 200,
		borderColor: 'gray',
		borderWidth: 1
	},
	button: {
		color: "#841584",
	},
});

export default styles;