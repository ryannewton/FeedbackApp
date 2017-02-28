'use strict';

//Import Libraries
import React, { Component } from 'react';
import { Text, View, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

//Import actions
import { saveEmail } from '../actions';

//Import componenets, functions, and styles
import RequireAuth from '../components/require_auth';
import { Button, Header } from '../components/common';
import styles from '../styles/settings_styles'; 

class Settings extends Component {
	componentWillMount() {
		this.setState({ email: this.props.auth.email });
	}

	render() {
		const { container, normalMargin, textDisplay, textInput } = styles;

		return (
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<View style={container}>
					<Header>
						Settings
					</Header>

					{/* Email update */}
					<View>
						<Text style={[normalMargin, textDisplay]}>
							Edit your email address
						</Text>
						<TextInput
							style={[normalMargin, textInput]}
							placeholder="Enter email here"
							multiline={Boolean(true)}
							onChangeText={(email) => this.setState({ email })}
							value={this.state.email}
						/>
					</View>

					{/* To do: add change password option*/}

					{/* Save button */}
					<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
						<Button
							onPress={() => {
								this.props.saveEmail(this.state.email);
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

export default connect(mapStateToProps, { saveEmail })(RequireAuth(Settings, 'Settings'));
