'use strict';

// Import libraries
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

// Import components and action creators
import { Card, CardSection, Input, Button, Header } from '../components/common';
import { emailChanged, passwordChanged } from '../actions';

class Login extends Component {
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

					{/* Login button */}
					<Button>
						Login
					</Button>

				</Card>
			</View>
		);
	}
}

const mapStateToProps = (state) => {
	const { email, password } = state.auth;
	return { email, password };
};

export default connect(mapStateToProps, { emailChanged, passwordChanged })(Login);
