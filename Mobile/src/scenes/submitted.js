'use strict';

//Import Libaries
import React, { Component } from 'react';
import {
	Text,
	View,
	Button,
	BackAndroid
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import Actions
import Actions from '../actions/actions.js';

//Import components, functions, and styles
import styles from '../styles/styles_main.js';

class Submitted extends Component {
	constructor(props: Object, context: any) {
		super(props, context);

		BackAndroid.addEventListener('hardwareBackPress', function() {
			props.navigate({type: 'pop'});
			return true;
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					You Submitted Feedback
				</Text>
				<Button
					onPress={() => this.props.navigate({type: 'pop'})}
					title="Submit More Feedback"
					style={styles.button}
				/>
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

