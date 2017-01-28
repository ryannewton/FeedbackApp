'use strict';

//Import Libraries
import React, { Component } from 'react';
import {
	Text,
	View,
	TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import Actions
import Actions from '../actions/actions.js';

//Import components, functions, and styles
import Button from '../components/button.js';
import Submitted from './submitted.js';
import styles from '../styles/styles_main.js'; 

class Email_Capture extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: props.main.email
		};
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					Enter Email:
				</Text>
				<Text style={[styles.normal_margin, { fontWeight: 'bold' }]}>
					Please enter your email address so we can keep you updated as your feedback is acted upon:
				</Text>
				<TextInput
					style={[styles.normal_margin, styles.text_input]}
					multiline={true}
					onChangeText={(email) => {
						this.setState({ email });
					}}
					value={this.state.email}
				/>
				<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
					<Button
						onPress={() => {
								this.props.save_email(this.state.email);
								this.props.submitFeedbackToServer(this.props.scene.route.text, this.state.email);
								this.props.navigate({ type: 'pop-push',
									route: {
										key: 'Submitted',
										component: Submitted
									}
								});
							}}	
						text="Save Email and Submit Feedback"
						style={{ marginTop: 10, width: 300 }}
					/>
				</View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Email_Capture);

