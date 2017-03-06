'use strict';

// Import Libraries
import React, { Component } from 'react';
import { Text, View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

// Import components and action creators
import { Card, CardSection, Input, Button, Spinner, Header } from '../components/common';
import { sendAuthorizationEmail, updateEmail, authorizeUserFail } from '../actions';
import styles from '../styles/styles_main.js';

class SendAuthorizationEmail extends Component {
	onButtonPress() {
		let re = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)*(?:hbs\.edu|stanford\.edu)$/;
		if (re.test(this.props.email)) {
			this.props.sendAuthorizationEmail(this.props.email);
		} else {
			this.props.authorizeUserFail("Invalid Email Address");
		}		
	}

	renderSignupButton() {
		return (
			<Button onPress={this.onButtonPress.bind(this)}>
				Send Authorization Email
			</Button>
		);
	}

	renderButtons() {
		if (this.props.loading) {
			return <Spinner />;
		}

		return (
			<View style={{ flex: 1 }}>
				{this.renderSignupButton()}
			</View>
		);
	}

	render() {
		return (
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<View style={styles.container}>
					<Header>
						Verify Your University
					</Header>


					<Card>
						{/* Email input */}
						<CardSection>
							<Input
								label="School Email"
								placeholder="my_username@my_university.edu"
								value={this.props.email}
								onChangeText={(text) => this.props.updateEmail(text)}
							/>
						</CardSection>

						{/* Error message (blank if no error) */}
						<Text style={styles.errorTextStyle}>
							{this.props.error}
						</Text>

						{/* Confirmation button, and 'go to login' button */}
						<CardSection>
							{this.renderButtons()}
						</CardSection>

						<CardSection>
							<Text style={styles.text}>
									Why do we need your email? Two reasons:{'\n'}
									1) We need to confirm you are member of your university{'\n'}
									2) We will keep you updated as changes are made based on your feedback
							</Text>
						</CardSection>
					</Card>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

const mapStateToProps = (state) => {
	const { email, error, loading } = state.auth;
	return { email, error, loading };
};

export default connect(mapStateToProps, { sendAuthorizationEmail, updateEmail, authorizeUserFail })(SendAuthorizationEmail);
