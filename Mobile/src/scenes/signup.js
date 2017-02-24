'use strict';

// Import Libraries
import React, { Component } from 'react';
import { Text, View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

// Import components and action creators
import { Card, CardSection, Input, Button, Spinner, Header } from '../components/common';
import {
	emailChanged,
	passwordChanged,
	passwordConfirmChanged,
	signupUser,
	signupUserFail,
	navigate
} from '../actions';
import styles from '../styles/styles_main.js';

class Signup extends Component {
	onButtonPress() {
		const { email } = this.props;
		this.props.signupUser({ email, password: 'password' });
	}

	renderSignupButton() {
		return (
			<Button onPress={this.onButtonPress.bind(this)}>
				Submit
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
						Enter Email
					</Header>


					<Card>
						{/* Email input */}
						<CardSection>
							<Input
								label="GSB email"
								placeholder="joe@gmail.com"
								value={this.props.email}
								onChangeText={(text) => this.props.emailChanged(text)}
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
									1) We need to confirm you are member of GSB{'\n'}
									2) We will occasionally update you on progress for your feedback
							</Text>
						</CardSection>
					</Card>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

const mapStateToProps = (state) => {
	const { email, password, passwordConfirm, error, loading, user } = state.auth;
	return { email, password, passwordConfirm, error, loading, user };
};

export default connect(mapStateToProps, {
	emailChanged,
	passwordChanged,
	passwordConfirmChanged,
	signupUser,
	signupUserFail,
	navigate
})(Signup);
