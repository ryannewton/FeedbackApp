'use strict';

//Import Libraries
import React, { Component } from 'react';
import {
	Text,
	View,
	Button,
	TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import Actions
import Actions from '../actions/actions.js';

//Import componenets, functions, and styles
import Submitted from './submitted.js';
import styles from '../styles/styles_main.js'; 

class Settings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: props.main.email
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					Settings
				</Text>
				<Text>
					Edit your email address
				</Text>
				<TextInput
					multiline={false}
					onChangeText={(email) => {
						this.setState({email});
					}}
					value={this.state.email}
				/>
				<Button
					onPress={() => this.props.save_email(this.state.email)}          
					title="Save"
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

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
