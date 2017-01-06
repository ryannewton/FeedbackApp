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

//Import componenets, functions, and styles
import Submitted from './submitted.js';
import {createAppNavigationContainer} from '../Navigation/Navigation_Functions.js';
import styles from '../../styles/styles_main.js'; 

const Settings = createAppNavigationContainer(class extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '...loading'
		}

		this.load_email = this.load_email.bind(this);
		this.save = this.save.bind(this);
		
		this.load_email();
	}

	async load_email() {
		try {
			const email = await AsyncStorage.getItem('@FeedbackApp:email');
			if (email !== null){
				this.setState({email});
			}
			else {
				this.setState({email: 'Please enter your email address here'});
			}
		} catch (error) {
			console.log(error);
		}
	}

	async save() {
		try {
			await AsyncStorage.setItem('@FeedbackApp:email', this.state.email);
		} catch (error) {
			console.log(error);
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					Settings
				</Text>
				<Text>
					Edit your email address
				</Text>
				<TextInput
					multiline={false}
					onChangeText={(email) => {
						this.setState({email});
					}}
					value={this.state.email}
				/>
				<Button
					onPress={this.save}          
					title="Save"
					style={styles.button}
				/>
			</View>
		);
	}
});

export default Settings;
