'use strict';

// Import libraries
import React, { Component } from 'react';
import { View } from 'react-native';

// Import components
import { Card, CardSection, Input, Button, Header } from '../components/common';

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
						/>
					</CardSection>

					{/* Password input */}
					<CardSection>
						<Input
							secureTextEntry
							label="Password"
							placeholder="password"
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

export default Login;
