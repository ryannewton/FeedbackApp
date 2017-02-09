'use strict';

// Import Libraries
import React, { Component } from 'react';
import { Text } from 'react-native';

// Import components
import { Card, CardSection, Input, Button } from '../components/common';

class Signup extends Component {
	render() {
		return (
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

				{/* Password confirm input */}
				<CardSection>
					<Input
						secureTextEntry
						label="Confirm Password"
						placeholder="password"
					/>
				</CardSection>

				{/* Confirmation button */}
				<Button>
					Signup
				</Button>
			</Card>
		);
	}
}

export default Signup;
