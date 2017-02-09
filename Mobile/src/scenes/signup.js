'use strict';

// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import components and action creators
import { Card, CardSection, Input, Button } from '../components/common';
import {
	emailChanged,
	passwordChanged,
	passwordConfirmChanged,
	signupUser
} from '../actions';

class Signup extends Component {
	onButtonPress() {
		const { email, password } = this.props;
		this.props.signupUser({ email, password });
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

				{/* Confirmation button */}
				<Button onPress={this.onButtonPress.bind(this)}>
					Signup
				</Button>
			</Card>
		);
	}
}

const mapStateToProps = (state) => {
	const { email, password, passwordConfirm } = state.auth;
	return { email, password, passwordConfirm };
};

export default connect(mapStateToProps, {
	emailChanged,
	passwordChanged,
	passwordConfirmChanged,
	signupUser
})(Signup);
