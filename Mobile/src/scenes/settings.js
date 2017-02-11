'use strict';

//Import Libraries
import React, { Component } from 'react';
import { Text, View, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import actions
import * as actions from '../actions';

//Import componenets, functions, and styles
import { Button, Header } from '../components/common';
import styles from '../styles/settings_styles'; 

class Settings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: props.main.email
		};
	}

	render() {
		const { container, normalMargin, textDisplay, textInput } = styles;

		return (
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<View style={container}>
					<Header>
						Settings
					</Header>

					{/* Update email description */}
					<Text style={[normalMargin, textDisplay]}>
						Edit your email address
					</Text>

					{/* Email update input */}
					<TextInput
						style={[normalMargin, textInput]}
						multiline={true}
						onChangeText={(email) => this.setState({ email })}
						value={this.state.email}
					/>

					{/* Save button */}
					<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
						<Button
							onPress={() => {
								this.props.save_email(this.state.email);
								Keyboard.dismiss();
							}}
							style={{ marginTop: 10 }}
						>
							Save
						</Button>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

function mapStateToProps(state) {
	return state;
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
