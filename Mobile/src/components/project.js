'use strict';

//Import Libraries
import React, { Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';

//Import componenets, functions, and styles
import styles from '../styles/styles_main.js';
import { Button, Card } from './common';
import { addUpvote, removeUpvote } from '../actions';

class Project extends Component {
	goToDetails() {
		this.props.navigate('Details', { project: this.props.project });
	}

	upvote() {
		const { project, user } = this.props;
		// If user hasn't upvoted this project, add an upvote
		if (!user.upvotes.includes(project.id)) {
			this.props.addUpvote(project);
		} else {
			this.props.removeUpvote(project);
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
		const { project, user } = this.props;
		let buttonStyles = { width: 80, height: 27, marginRight: 2 };
		let textStyles = {};
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
		const { buttonText, lowWeight, row } = styles;

		return (
			<Card>
				<TouchableHighlight
					style={row}
					underlayColor='#D0D0D0'
					onPress={this.goToDetails.bind(this)}
				>

					<View style={{ justifyContent: 'flex-start' }}>
						{/* Project title */}
						<Text style={buttonText}>
							{this.renderTitle()}
						</Text>

						{/* Vote section */}
						<View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
							{/* Vote count */}
							<View style={{ flex: 3 }}>
								<Text style={[buttonText, lowWeight]}>
									{this.renderVoteCount()}
								</Text>
							</View>

							{/* Upvote button */}
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

export default connect(mapStateToProps, { addUpvote, removeUpvote })(Project);
