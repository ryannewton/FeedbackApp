'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
	Text,
	PixelRatio,
	StyleSheet,
	View,
	TouchableHighlight,
} = ReactNative;

class NavigationExampleRow extends React.Component {
	render() {
		if (this.props.onPress) {
			return (
				<TouchableHighlight
					style={styles.row}
					underlayColor="#D0D0D0"
					onPress={this.props.onPress}>
					<Text style={styles.buttonText}>
						{this.props.text}
					</Text>
				</TouchableHighlight>
			);
		}
		return (
			<View style={styles.row}>
				<Text style={styles.rowText}>
					{this.props.text}
				</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	row: {
		padding: 15,
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
});

module.exports = NavigationExampleRow;