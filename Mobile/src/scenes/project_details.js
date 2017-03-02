'use strict';

//Import Libraries
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { connect } from 'react-redux';

//Import componenets, functions, and styles
import styles from '../styles/styles_main.js';
import { addUpvote, removeUpvote } from '../actions';
import { Button, Header, Card, CardSection } from '../components/common';

class ProjectDetails extends Component {
	constructor(props) {
		super(props);

		const { project } = this.props.navigationState.routes.slice(-1)[0];
		this.state = { project };
	}

	upvote() {
		const { user } = this.props;
		const { project } = this.state;
		// If user hasn't upvoted this project, add an upvote
		if (!user.upvotes.includes(project.id)) {
			this.props.addUpvote(project);
		} else {
			this.props.removeUpvote(project);
		}
	}

	projectDescription() {
		const { buttonText, lowWeight } = styles;
		return (
			<View style={{ justifyContent: 'flex-start' }}>
				{/* Project title */}
				<Text style={buttonText}>
					{this.state.project.title}
				</Text>

				{/* Vote section */}
				<View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
					{/* Vote count */}
					<View style={{ flex: 3 }}>
						<Text style={[buttonText, lowWeight]}>
							{`${this.state.project.votes} Votes`}
						</Text>
					</View>

					{/* Upvote button */}
					<View style={{ flex: 1, alignItems: 'flex-end' }}>
						{this.renderButton()}
					</View>
				</View>
			</View>
		);
	}

	renderButton() {
		const { user } = this.props;
		const { project } = this.state;
		let buttonStyles = { width: 80, height: 27, marginRight: 2 };
		let textStyles = { paddingTop: 10, paddingBottom: 10 };
		// If user hasn't upvoted this project
		if (user.upvotes.includes(project.id)) {
			buttonStyles = { ...buttonStyles, backgroundColor: '#007aff' };
			textStyles = { ...textStyles, color: '#fff' };
		}
		return (
			<Button
				onPress={this.upvote.bind(this)}
				style={buttonStyles}
				textStyle={textStyles}
			>
				Upvote!
			</Button>
		);
	}

	render() {
		const { container } = styles;
		return (
			<TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
				<View style={container}>

					<Header>
						Projects Details
					</Header>

					<Card>
						<CardSection>
							{this.projectDescription()}
						</CardSection>
					</Card>

					<Card>
						<CardSection>
							<Text>Suggested solutions:</Text>
						</CardSection>
					</Card>

					<Card>
						<CardSection>
							<Text style={{ textAlign: 'center' }}>Add a solution:</Text>
						</CardSection>
						<CardSection>
							<TextInput />
						</CardSection>

					</Card>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

function mapStateToProps(state) {
	const { user } = state;
	return { user };
}

export default connect(mapStateToProps, { addUpvote, removeUpvote })(ProjectDetails);
