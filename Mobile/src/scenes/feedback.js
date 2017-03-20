'use strict';

//Import libaries
import React, { Component } from 'react';
import { View, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { MenuContext } from 'react-native-menu';

//Import actions
import { feedbackChanged, submitFeedbackToServer, navigate } from '../actions';

//Import components, functions, and styles
import RequireAuth from '../components/require_auth';
import { Button, HeaderPlusMenu, Spinner } from '../components/common';
import Submitted from './submitted.js';
import styles from '../styles/styles_main.js';

class Feedback extends Component {
	constructor(props: Object, context: any) {
		super(props, context);

		this.state = {
			height: 0,
		};
	}

	submitFeedback() {
		let scene = { key: 'Submitted', component: Submitted };
		let route = { type: 'push', route: scene };			
		this.props.submitFeedbackToServer(route);		
	}

	renderButton() {
		if (this.props.loading) {
			return <Spinner size="large" style={{ justifyContent: 'flex-start', marginTop: 20 }} />;
		}
		return (
			<Button	onPress={this.submitFeedback.bind(this)}>
				Submit Feedback
			</Button>
		);
	}

	render() {
		const placeholderText = 'Enter your feedback here. We will work on addressing it with the appropriate administrator!';

		return (
			<MenuContext style={{ flex: 1 }} ref="MenuContext">
				<TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
					<View style={styles.container}>
						<HeaderPlusMenu navigate={this.props.navigate}>
							Enter your feedback here
						</HeaderPlusMenu>

						{/* Feedback input box */}
						<TextInput
							multiline={Boolean(true)}
							onChangeText={(feedback) => this.props.feedbackChanged(feedback)}
							onContentSizeChange={(event) => {
								this.setState({ height: event.nativeEvent.contentSize.height });
							}}
							style={styles.feedback_input}
							placeholder={placeholderText}
							value={this.props.feedback}
						/>

						{/* Submit button / loading spinner */}
						{this.renderButton()}
					</View>
				</TouchableWithoutFeedback>
			</MenuContext>
		);
	}
}

function mapStateToProps(state) {
	const { feedback, loading } = state.main;
	return { feedback, loading };
}

export default connect(mapStateToProps, {
	feedbackChanged,
	submitFeedbackToServer,
	navigate
})(RequireAuth(Feedback));
