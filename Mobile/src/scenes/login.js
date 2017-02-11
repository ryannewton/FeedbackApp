'use strict';

// Import libraries
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

// Import components and action creators
import Signup from './signup';
import { Card, CardSection, Input, Button, Header, Spinner } from '../components/common';
import { emailChanged, passwordChanged, loginUser, navigate } from '../actions';

class Login extends Component {
	onButtonPress() {
		const { email, password } = this.props;
		this.props.loginUser({ email, password });
	}

	renderSignupButton() {
		const scene = { key: 'Signup', component: Signup };
		const route = { type: 'push', route: scene };
		return (
			<Button onPress={() => this.props.navigate(route)}>
				Sign Up
			</Button>
		);
	}

	renderLoginButton() {
		return (
			<Button onPress={this.onButtonPress.bind(this)}>
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
				{this.renderLoginButton()}
				<Text>Don't have an account?</Text>
				{this.renderSignupButton()}
			</View>
		);
	}

	render() {
		return (
			<View>
				<Header>
					Login
				</Header>
				<Card>
					{/* Email input */}
					<CardSection>
						<Input
							label="Email"
							placeholder="joe@gmail.com"
							onChangeText={(text) => this.props.emailChanged(text)}
							value={this.props.email}
						/>
					</CardSection>

					{/* Password input */}
					<CardSection>
						<Input
							secureTextEntry
							label="Password"
							placeholder="password"
							onChangeText={(text) => this.props.passwordChanged(text)}
							value={this.props.password}
						/>
					</CardSection>

					{/* Error message (if any) */}
					<Text style={styles.errorTextStyle}>
						{this.props.error}
					</Text>

					{/* Confirmation buttons, and 'go to signup' button */}
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
	const { email, password, loading, user, error } = state.auth;
	return { email, password, loading, user, error };
};

export default connect(mapStateToProps, {
	emailChanged,
	passwordChanged,
	loginUser,
	navigate
})(Login);
