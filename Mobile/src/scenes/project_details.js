'use strict';

//Import Libraries
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { connect } from 'react-redux';

//Import componenets, functions, and styles
import styles from '../styles/project_details_styles.js';
import { Button, Card, CardSection } from '../components/common';
import {
	addUpvote,
	removeUpvote,
	solutionChanged,
	submitSolutionToServer
} from '../actions';

class ProjectDetails extends Component {
	upvote() {
		const { user } = this.props;
		const { project } = this.props.navigation.state.params;
		// If user hasn't upvoted this project, add an upvote
		if (!user.upvotes.includes(project.id)) {
			this.props.addUpvote(project);
		} else {
			this.props.removeUpvote(project);
		}
	}

	projectDescription() {
		const { buttonText, lowWeight } = styles;
		const { project } = this.props.navigation.state.params;

		return (
			<View style={{ justifyContent: 'flex-start' }}>
				{/* Project title */}
				<Text style={buttonText}>
					{project.title}
				</Text>

				{/* Vote section */}
				<View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
					{/* Vote count */}
					<View style={{ flex: 3 }}>
						<Text style={[buttonText, lowWeight]}>
							{`${project.votes} Votes`}
						</Text>
					</View>

					{/* Upvote button */}
					<View style={{ flex: 1 }}>
						{this.renderUpvoteButton()}
					</View>
				</View>
			</View>
		);
	}

	solutionsList() {
		const { text } = styles;
		const { solutions } = this.props;
		const { project } = this.props.navigation.state.params;
		const projectSolutions = solutions.filter((solution) => solution.project_id === project.id);

		// If no solutions have been submitted
		if (projectSolutions.length === 0) {
			return (
				<CardSection>
					<Text>No solutions submitted yet. Be the first!</Text>
				</CardSection>
			);
		}

		const formattedSolutions = projectSolutions.map((solution, index) => (
			<CardSection key={index} >
				<Text>{solution.description}</Text>
			</CardSection>
		));

		return (
			<View>
				<CardSection>
					<Text style={text}>Suggested solutions:</Text>
				</CardSection>
				{formattedSolutions}
			</View>
		);
	}

	renderUpvoteButton() {
		const { user } = this.props;
		const { project } = this.props.navigation.state.params;
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

	renderSubmitButton() {
		const { solution } = this.props.main;
		const { project } = this.props.navigation.state.params;

		return (
			<Button	onPress={() => this.props.submitSolutionToServer(solution, project.id)}>
				Submit Suggestion
			</Button>
		);
	}

	render() {
		const { container, inputText } = styles;
		return (
			<TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
				<View style={container}>

					<Card>
						<CardSection>
							{this.projectDescription()}
						</CardSection>
					</Card>

					<Card>
						{this.solutionsList()}
					</Card>

					<TextInput
						multiline={Boolean(true)}
						style={inputText}
						placeholder='Submit a suggestion'
						onChangeText={(solution) => this.props.solutionChanged(solution)}
						value={this.props.main.solution}
					/>

					{this.renderSubmitButton()}

				</View>
			</TouchableWithoutFeedback>
		);
	}
}

function mapStateToProps(state) {
	const { user, solutions, main } = state;
	return { user, solutions, main };
}

const AppScreen = connect(mapStateToProps, {
	addUpvote,
	removeUpvote,
	solutionChanged,
	submitSolutionToServer
})(ProjectDetails);

AppScreen.navigationOptions = {
	title: 'Project Details'
};

export default AppScreen;
