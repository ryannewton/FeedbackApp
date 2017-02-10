'use strict';

//Import libaries
import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import actions
import * as actions from '../actions';

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
			text: placeholderText,
			anonymous: false
		};
	}

	submitFeedback() {
		let scene = {};
		let route = {};
		const { text } = this.state;
		const { email } = this.props.main;

		// If email address is on file, go to submitted scene
		if (email !== 'Enter email here') {
			scene = { key: 'Submitted', component: Submitted };
			route = { type: 'push', route: scene };
			this.props.submitFeedbackToServer(text, email, route, this.props.navigate);
		} else {
			// Otherwise, go to email_capture scene when done
			scene = { key: 'Signup', text, component: Signup };
			route = { type: 'push', route: scene };
			this.props.navigate(route);
		}
		this.setState({ text: placeholderText });
	}

	renderButton() {
		if (this.props.main.loading) {
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
			<View style={[styles.container, { alignItems: 'center' }]}>
				<Header>
					Thanks for providing feedback!
				</Header>

				{/* Feedback input box */}
				<View style={{ paddingTop: 10, paddingHorizontal: 5, flexDirection: 'row' }}>
					<TextInput
						multiline={true}
						onChangeText={(text) => {
							this.setState({ text });
						}}
						onFocus={() => {
							if (this.state.text === placeholderText) {
								this.setState({ text: '' });
							}
						}}
						onContentSizeChange={(event) => {
							this.setState({ height: event.nativeEvent.contentSize.height });
						}}
						style={styles.feedback_input}
						value={this.state.text}
					/>
				</View>

				{/* Submit button / loading spinner */}
				<View style={{ flexDirection: 'row' }}>
					<View style={{ flex: 1, paddingHorizontal: 3 }}>
						{this.renderButton()}
					</View>
				</View>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return state;
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
