'use strict';

// Import Libraries
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';

// Import components and action creators
import Login from './login';
import { Card, CardSection, Input, Button, Spinner, Header } from '../components/common';
import {
	emailChanged,
	passwordChanged,
	passwordConfirmChanged,
	signupUser,
	signupUserFail,
	navigate
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

	renderSignupButton() {
		return (
			<Button onPress={this.onButtonPress.bind(this)}>
				Sign Up
			</Button>
		);
	}

	renderLoginButton() {
		const scene = { key: 'Login', component: Login };
		const route = { type: 'push', route: scene };
		return (
			<Button onPress={() => this.props.navigate(route)}>
				Login
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
				<Text>Already have an account?</Text>
				{this.renderLoginButton()}
			</View>
		);
	}

	render() {
		return (
			<View>
				<Header>
					Sign Up
				</Header>

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

					{/* Confirmation button, and 'go to login' button */}
					<CardSection>
						{this.renderButtons()}
					</CardSection>
				</Card>
			</View>
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
