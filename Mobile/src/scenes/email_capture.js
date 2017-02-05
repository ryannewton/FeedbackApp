'use strict';

// Collects email after they submit feedback for new users

//Import Libraries
import React, { Component } from 'react';
import {
	Text,
	View,
	TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import actions
import * as actions from '../actions';

//Import components, functions, and styles
import { Button, Header } from '../components/common';
import Submitted from './submitted.js';
import styles from '../styles/email_capture_styles'; 

class EmailCapture extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: props.main.email
		};
	}

	render() {
		const { container, normalMargin, textDisplay, textInput } = styles;

		return (
			<View style={container}>
				<Header>
					Enter Email:
				</Header>
				<Text style={[normalMargin, textDisplay]}>
					Please enter your email address so we can keep you updated as your feedback is acted upon:
				</Text>
				<TextInput
					style={[normalMargin, textInput]}
					multiline={true}
					onChangeText={(email) => {
						this.setState({ email });
					}}
					value={this.state.email}
				/>
				<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
					<Button
						onPress={() => {
								this.props.save_email(this.state.email);
								this.props.submitFeedbackToServer(this.props.scene.route.text, this.state.email);
								this.props.navigate({ type: 'pop-push',
									route: {
										key: 'Submitted',
										component: Submitted
									}
								});
							}}
						style={{ marginTop: 10, width: 300 }}
					>
						Save Email and Submit Feedback
					</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(EmailCapture);

