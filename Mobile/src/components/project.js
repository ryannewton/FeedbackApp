'use strict';

//Import Libraries
import React, { Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';

//Import componenets, functions, and styles
import ProjectDetails from '../scenes/project_details.js';
import styles from '../styles/styles_main.js';
import { Button, Card } from './common';
import { addUpVote, removeUpVote } from '../actions';

class Project extends Component {
	goToDetails() {
		//const route = {key: 'ProjectDetails', project: this.props.project, component: ProjectDetails};
		//this.props.navigate({type: 'push', route});
	}

	upvote() {
		const { project, user } = this.props;

		// If user hasn't upvoted this project, add an upvote
		if (user.upvotes.indexOf(project.id) === -1) {
			this.props.addUpVote(project);
		} else {
			this.props.removeUpVote(project);
		}
	}

	// Temporary fix. Async issue is causing this.props.project to be temporarily undefined
	renderVoteCount() {
		if (this.props.project === undefined) {
			return '';
		}
		return `${this.props.project.votes} Votes`;
	}

	// Temporary fix. Async issue is causing this.props.project to be temporarily undefined
	renderTitle() {
		if (this.props.project === undefined) {
			return '';
		}
		return this.props.project.title;
	}

	renderButton() {
		let buttonStyle = { width: 60, height: 24, marginRight: 2 };
		let textStyle = { fontSize: 14, paddingTop: 10, paddingBottom: 10 };
		const { project, user } = this.props;

		// If user has not upvoted this project, add grey styling
		if (user.upvotes.indexOf(project.id) === -1) {
			buttonStyle.borderColor = '#808080';
			textStyle.color = '#808080';
		}

		return (
			<Button
				onPress={this.upvote.bind(this)}
				style={buttonStyle}
				textStyle={textStyle}
			>
				Upvote!
			</Button>
		);
	}

	render() {
		const { buttonText, lowWeight, row } = styles;

		return (
			<Card>
				<TouchableHighlight
					style={row}
					underlayColor='#D0D0D0'
					onPress={this.goToDetails}
				>

					<View style={{ justifyContent: 'flex-start' }}>
						{/* Project title */}
						<Text style={buttonText}>
							{this.renderTitle()}
						</Text>

						{/* Vote section */}
						<View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
							{/* Vote count */}
							<View style={{ flex: 1 }}>
								<Text style={[buttonText, lowWeight]}>
									{this.renderVoteCount()}
								</Text>
							</View>

							{/* Upvote button */}
							{/* To do: change button styling when user has already upvoted project */}
							<View style={{ flex: 1, alignItems: 'flex-end' }}>
								{this.renderButton()}
							</View>
						</View>
					</View>

				</TouchableHighlight>
			</Card>
		);
	}
}

const mapStateToProps = (state) => {
	const { user } = state;
	return { user };
};

export default connect(mapStateToProps, { addUpVote, removeUpVote })(Project);
