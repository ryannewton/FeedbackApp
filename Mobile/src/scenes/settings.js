'use strict';

//Import Libraries
import React, { Component } from 'react';
import {
	Text,
	View,
	TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import Actions
import Actions from '../actions/actions.js';

//Import componenets, functions, and styles
import Button from '../components/button.js';
import Submitted from './submitted.js';
import styles from '../styles/styles_main.js'; 

class Settings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: props.main.email
		};
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					Settings
				</Text>
				<Text style={[styles.normal_margin, { fontWeight: 'bold' }]}>
					Edit your email address
				</Text>
				<TextInput
					style={[styles.normal_margin, styles.text_input]}
					multiline={true}
					onChangeText={(email) => {
						this.setState({ email });
					}}
					value={this.state.email}
				/>
				<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
					<Button
						onPress={() => this.props.save_email(this.state.email)}          
						text="Save"
						style={{ marginTop: 10, width: 300 }}
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

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
