'use strict';

//Import Libraries
import React, { Component } from 'react';
import {
	Text,
	View,
	Button,
	TextInput,
	AsyncStorage
} from 'react-native';

//Import components, functions, and styles
import Submitted from './submitted.js';
import {createAppNavigationContainer} from '../Navigation/Navigation_Functions.js';
import styles from '../../styles/styles_main.js'; 

const Email_Capture = createAppNavigationContainer(class extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: null
		}

		this.save = this.save.bind(this);
		this._pushRoute = this._pushRoute.bind(this);
		this.submitFeedbackToServer = this.submitFeedbackToServer.bind(this);
	}

	async save() {
		try {
			await AsyncStorage.setItem('@FeedbackApp:email', this.state.email);
		} catch (error) {
			console.log(error);
		}
	}

	_pushRoute(): void {
		const route = {key: 'Submitted', component: Submitted};
		this.props.navigate({type: 'pop-push', route});
	}

	submitFeedbackToServer(text, email) {
		let time = new Date(Date.now()).toISOString().slice(0, 10);

		return fetch('https://stanfordfeedback.com/addFeedback/', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				text,
				time,
				email
			}),
		})
		.catch((error) => {
			console.error(error);
		});
	}  

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					Enter Email:
				</Text>
				<Text>
					Please enter your email address so we can keep you updated as your feedback is acted upon:
				</Text>
				<TextInput
					multiline={false}
					onChangeText={(email) => {
						this.setState({email});
					}}
					value={this.state.email}
				/>
				<Button
					onPress={() => {this.save().then(
						() => {
							//this.submitFeedbackToServer(this.props.scene.route.text, this.state.email);
							this._pushRoute();
						})
				 }}
					title="Save Email and Submit Feedback"
					style={styles.button}
				/>
			</View>
		);
	}
});

export default Email_Capture;