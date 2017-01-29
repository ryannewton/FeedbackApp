'use strict';

//Import Libaries
import React, { Component } from 'react';
import {
	Text,
	View,
	BackAndroid
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import Actions
import Actions from '../actions';

//Import components, functions, and styles
import Button from '../components/button.js';
import styles from '../styles/styles_main.js';

class Submitted extends Component {
	constructor(props: Object, context: any) {
		super(props, context);

		BackAndroid.addEventListener('hardwareBackPress', () => {
			props.navigate({ type: 'pop' });
			return true;
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					You Submitted Feedback
				</Text>
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<Button
						onPress={() => this.props.navigate({ type: 'pop' })}
						text="Submit More Feedback"
						style={{ height: 200, width: 300 }}
					/>
				</View>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return state;
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Submitted);
