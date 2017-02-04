'use strict';

import {
	StyleSheet,
	PixelRatio,
	Platform
} from 'react-native';

const styles = StyleSheet.create({

	//Feedback Scene
	container: {
		backgroundColor: '#F7FCFF',
		flex: 1
	},
	welcome: {
		fontSize: 18,
		textAlign: 'center',
		marginTop: (Platform.OS === 'ios') ? 20 : 10,
		marginBottom: 6		
	},
	feedback_input: {
		fontSize: 18,
		height: 200,
		borderColor: 'gray',
		borderWidth: 1,
		borderRadius: 4,
		margin: 3,
		paddingLeft: 8,
		paddingRight: 8,
		backgroundColor: '#FFFFFF',
		...Platform.select({
			android: {
				width: 340
			},
		}),
	},

	//Navigation	
	navigator: {
		flex: 1,
	},
	navigatorCardStack: {
		flex: 12,
	},
	tabs: {
		flex: 1,
		flexDirection: 'row',
	},
	tab: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#E0E0E0',
		justifyContent: 'center',
		borderLeftWidth: 0.5,
		borderRightWidth: 0.5,
		borderColor: '#FFFFFF'
	},
	tabText: {
		color: '#222',
		fontWeight: '500',
	},
	tabSelected: {
		color: 'blue',
	},
	
	//Projects
	row: {
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 5,
		paddingBottom: 8,
		backgroundColor: 'white',
		borderBottomWidth: 1 / PixelRatio.get(),
		borderBottomColor: '#CDCDCD',
	},
	rowText: {
		fontSize: 17,
	},
	buttonText: {
		fontSize: 17,
		fontWeight: '500',
	},
	project: {

	},
	lowWeight: {
		fontWeight: '300',
		fontSize: 16,
		textDecorationLine: 'underline',
	}
});

export default styles;
