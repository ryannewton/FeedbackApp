'use strict';

//Import libaries
import React, { Component } from 'react';
import { Text, View, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import Actions
import actions from '../actions';

//Import components, functions, and styles
import { Button, Header } from '../components/common';
import Submitted from './submitted.js';
import Email_Capture from './email_capture.js';
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

		this.submitFeedback = this.submitFeedback.bind(this);
	}

	submitFeedback() {
		let route = {};
		if (this.props.main.email !== 'Enter email here') {
			this.props.submitFeedbackToServer(this.state.text, this.props.main.email);
			route = { key: 'Submitted', component: Submitted };
		} else {
			route = { key: 'Email_Capture', text: this.state.text, component: Email_Capture };
		}
		this.setState({ text: placeholderText });
		this.props.navigate({ type: 'push', route });
	}

	render() {
		return (
			<View style={[styles.container, { alignItems: 'center' }]}>
				<Header>
					Thanks for providing feedback!
				</Header>

				<View style={{ paddingTop: 10 }}>
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

				<Button	onPress={this.submitFeedback} style={{ marginTop: 10, height: 50 }}>
					Submit Feedback
				</Button>
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
