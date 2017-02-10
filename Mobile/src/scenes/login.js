'use strict';

// Import libraries
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

// Import components and action creators
import { Card, CardSection, Input, Button, Header } from '../components/common';
import { emailChanged, passwordChanged, loginUser } from '../actions';

class Login extends Component {
	onButtonPress() {
		const { email, password } = this.props;
		this.props.loginUser({ email, password });
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

					{/* Login button */}
					<Button onPress={this.onButtonPress.bind(this)}>
						Login
					</Button>

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
	loginUser
})(Login);
