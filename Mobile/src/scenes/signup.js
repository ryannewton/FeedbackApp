'use strict';

// Import Libraries
import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';

// Import components and action creators
import { Card, CardSection, Input, Button } from '../components/common';
import {
	emailChanged,
	passwordChanged,
	passwordConfirmChanged,
	signupUser,
	signupUserFail
} from '../actions';

class Signup extends Component {
	onButtonPress() {
		const { email, password, passwordConfirm } = this.props;
		if (password !== passwordConfirm) {
			const errorMessage = 'Passwords must match';
			this.props.signupUserFail(errorMessage);
		} else {
			this.props.signupUser({ email, password });
		}
	}

	render() {
		return (
			<Card>
				{/* Email input */}
				<CardSection>
					<Input
						label="Email"
						placeholder="joe@gmail.com"
						value={this.props.email}
						onChangeText={(text) => this.props.emailChanged(text)}
					/>
				</CardSection>

				{/* Password input */}
				<CardSection>
					<Input
						secureTextEntry
						label="Password"
						placeholder="password"
						value={this.props.password}
						onChangeText={(text) => this.props.passwordChanged(text)}
					/>
				</CardSection>

				{/* Password confirm input */}
				<CardSection>
					<Input
						secureTextEntry
						label="Confirm Password"
						placeholder="password"
						value={this.props.passwordConfirm}
						onChangeText={(text) => this.props.passwordConfirmChanged(text)}
					/>
				</CardSection>

				{/* Error message (blank if no error) */}
				<Text style={styles.errorTextStyle}>
					{this.props.error}
				</Text>

				{/* Confirmation button */}
				<Button onPress={this.onButtonPress.bind(this)}>
					Signup
				</Button>
			</Card>
		);
	}
}

const styles = {
	errorTextStyle: {
		fontSize: 20,
		alignSelf: 'center',
		color: 'red'
	}
};

const mapStateToProps = (state) => {
	const { email, password, passwordConfirm, error } = state.auth;
	return { email, password, passwordConfirm, error };
};

export default connect(mapStateToProps, {
	emailChanged,
	passwordChanged,
	passwordConfirmChanged,
	signupUser,
	signupUserFail
})(Signup);
