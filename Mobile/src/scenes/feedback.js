'use strict';

//Import libaries
import React, { Component, PropTypes } from 'react';
import { Text, View, Button,	TextInput, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import Actions
import Actions from '../actions/actions.js';

//Import components, functions, and styles
import Submitted from './submitted.js';
import Email_Capture from './email_capture.js';
import styles from '../styles/styles_main.js'; 

class Feedback extends Component {

	constructor(props: Object, context: any) {
		super(props, context);

		this.state = {      
			height: 0,
			text: "Enter your feedback here. We will discuss it with the appropriate department head on Monday and get back to you with their response."
		};

		this.submitFeedback = this.submitFeedback.bind(this);
	}

	submitFeedback() {
		let route = {};
		if (this.props.main.email !== "Please set your email") {
			//this.props.submitFeedbackToServer(this.state.text, this.props.main.email);
			route = {key: 'Submitted', component: Submitted};
		}
		else {
			route = {key: 'Email_Capture', text: this.state.text, component: Email_Capture};
		}
		this.setState({text: "Enter your feedback here. We will discuss it with the appropriate department head on Monday and get back to you with their response."});
		this.props.navigate({type: 'push', route});
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
			</View>
		);
	}
}

function mapStateToProps(state) {
	return state;
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);


