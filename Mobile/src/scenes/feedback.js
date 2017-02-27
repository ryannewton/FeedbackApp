'use strict';

//Import libaries
import React, { Component } from 'react';
import { View, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

//Import actions
import { feedbackChanged, submitFeedbackToServer, navigate } from '../actions';

//Import components, functions, and styles
import RequireAuth from '../components/require_auth';
import { Button, HeaderPlusMenu, Spinner } from '../components/common';
import Submitted from './submitted.js';
import Signup from './signup';
import styles from '../styles/styles_main.js';

import {
	MenuContext,
} from 'react-native-menu';


const placeholderText = 'Enter your feedback here. We will discuss it with the ' +
	'appropriate department head on Monday and get back to you with their response.';

class Feedback extends Component {
	constructor(props: Object, context: any) {
		super(props, context);

		this.state = {
			height: 0,
			anonymous: false
		};

	}

	submitFeedback() {
		let scene = {};
		let route = {};

		// If email address is on file, go to submitted scene
		if (this.props.email !== '') {
			scene = { key: 'Submitted', component: Submitted };
			route = { type: 'push', route: scene };
			this.props.submitFeedbackToServer(route);
		} else {
			// Otherwise, go to Signup scene when done
			console.log("error, no email");
			//scene = { key: 'Signup', component: Signup };
			//route = { type: 'push', route: scene };
			//this.props.navigate(route);
		}
	}

	renderButton() {
		if (this.props.loading) {
			return <Spinner size="large" style={{ justifyContent: 'flex-start', marginTop: 20 }} />;
		}
		return (
			<Button	onPress={this.submitFeedback.bind(this)}>
				Submit Feedback
			</Button>
		);
	}

	render() {
		return (
			<MenuContext style={{ flex: 1}} ref="MenuContext">
				<TouchableWithoutFeedback style={{ flex: 1}} onPress={() => Keyboard.dismiss()}>
					<View style={styles.container}>
						<HeaderPlusMenu navigate={this.props.navigate}>
							Thanks for providing feedback!
						</HeaderPlusMenu>

						{/* Feedback input box */}
						<TextInput
							multiline={Boolean(true)}
							onChangeText={(feedback) => {
								this.props.feedbackChanged(feedback);
							}}
							onFocus={() => {
								if (this.props.feedback === placeholderText) {
									this.props.feedbackChanged('');
								}
							}}
							onContentSizeChange={(event) => {
								this.setState({ height: event.nativeEvent.contentSize.height });
							}}
							style={styles.feedback_input}
							value={this.props.feedback}
						/>

						{/* Submit button / loading spinner */}
						{this.renderButton()}
					</View>
				</TouchableWithoutFeedback>
			</MenuContext>
		);
	}
}

function mapStateToProps(state) {
	const { feedback, loading } = state.main;
	const { email } = state.auth;
	return { feedback, email, loading };
}

export default connect(mapStateToProps, {
	feedbackChanged,
	submitFeedbackToServer,
	navigate
})(RequireAuth(Feedback, 'Feedback'));
