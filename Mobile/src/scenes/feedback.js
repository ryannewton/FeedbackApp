'use strict';

//Import libaries
import React, { Component } from 'react';
import { View, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

//Import actions
import { feedbackChanged, submitFeedbackToServer, navigate } from '../actions';

//Import components, functions, and styles
import { Button, Header, Spinner } from '../components/common';
import Submitted from './submitted.js';
import Signup from './signup';
import styles from '../styles/styles_main.js';


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
		const { feedback, email } = this.props;

		// If email address is on file, go to submitted scene
		if (email !== 'Enter email here') {
			scene = { key: 'Submitted', component: Submitted };
			route = { type: 'push', route: scene };
			this.props.submitFeedbackToServer(feedback, email, route);
		} else {
			// Otherwise, go to email_capture scene when done
			scene = { key: 'Signup', component: Signup };
			route = { type: 'push', route: scene };
			this.props.navigate(route);
		}
	}

	renderButton() {
		if (this.props.loading) {
			return <Spinner size="large" style={{ justifyContent: 'flex-start', marginTop: 20 }} />;
		}
		return (
			<Button	onPress={this.submitFeedback.bind(this)} style={{ marginTop: 10, height: 50 }}>
				Submit Feedback
			</Button>
		);
	}

	render() {
		return (
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<View style={[styles.container, { alignItems: 'center' }]}>
					<Header>
						Thanks for providing feedback!
					</Header>

					{/* Feedback input box */}
					<View style={{ paddingTop: 10, paddingHorizontal: 5, flexDirection: 'row' }}>
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
					</View>

					{/* Submit button / loading spinner */}
					<View style={{ flexDirection: 'row' }}>
						<View style={{ flex: 1, paddingHorizontal: 3 }}>
							{this.renderButton()}
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

function mapStateToProps(state) {
	const { feedback, email, loading } = state.main;
	return { feedback, email, loading };
}

export default connect(mapStateToProps, {
	feedbackChanged,
	submitFeedbackToServer,
	navigate
})(Feedback);
