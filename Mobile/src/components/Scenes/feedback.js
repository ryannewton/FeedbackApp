'use strict';

//Import libaries
import React, { Component, PropTypes } from 'react';
import {
	NavigationExperimental,
	Text,
	View,
	Button,
	TextInput,
	AsyncStorage
} from 'react-native';

const {
	CardStack: NavigationCardStack,
	PropTypes: NavigationPropTypes,
	StateUtils: NavigationStateUtils,
} = NavigationExperimental;

//Import components, functions, and styles
import Submitted from './submitted.js';
import Email_Capture from './email_capture.js';
import {createAppNavigationContainer} from '../Navigation/Navigation_Functions.js';
import styles from '../../styles/styles_main.js'; 

const Feedback = createAppNavigationContainer(class extends Component {

	static propTypes = {
		...NavigationPropTypes.SceneRendererProps,
		navigate: PropTypes.func.isRequired,
	};

	constructor(props: Object, context: any) {
		super(props, context);

		this.state = {      
			height: 0,
			text: "Enter your feedback here. We will discuss it with the appropriate department head on Monday and get back to you with their response."
		};

		this.load_email = this.load_email.bind(this);
		this.submitFeedbackToServer = this.submitFeedbackToServer.bind(this);
		this.submitFeedback = this.submitFeedback.bind(this);
		this.deleteEmail = this.deleteEmail.bind(this);
	}

	submitFeedback() {
		this.load_email().then(email => {
			let route = {};
			if (email !== null) {
				//this.submitFeedbackToServer(this.state.text, email);
				route = {key: 'Submitted', component: Submitted};
			}
			else {
				route = {key: 'Email_Capture', text: this.state.text, component: Email_Capture};
			}
			this.props.navigate({type: 'push', route});
		});
	}

	async load_email() {
		try {
			return await AsyncStorage.getItem('@FeedbackApp:email');
		} catch (error) {
			console.log(error);
		}
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

	async deleteEmail() {
		try {
			await AsyncStorage.removeItem('@FeedbackApp:email');
		} catch (error) {
			console.log(error);
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					Thanks for providing feedback!
				</Text>
				<TextInput
					multiline={true}
					onChangeText={(text) => {
						this.setState({text});
					}}
					onFocus={() => {
						if (this.state.text === "Enter your feedback here. We will discuss it with the appropriate department head on Monday and get back to you with their response.") {
							this.setState({text: ""});
						}
					}}
					onContentSizeChange={(event) => {
						this.setState({height: event.nativeEvent.contentSize.height});
					}}
					style={styles.feedback_input}
					value={this.state.text}
				/>
				<Button
					onPress={this.submitFeedback}          
					title="Submit Feedback"
					style={styles.button}
				/>
				<Button
					onPress={this.deleteEmail}          
					title="Delete Email"
					style={styles.button}
				/>
			</View>
		);
	}
});

export default Feedback;
