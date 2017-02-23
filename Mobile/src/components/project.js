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
		if (user.upvotes.contains(project.id)) {
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
							<View style={{ flex: 1, alignItems: 'flex-end' }}>
								<Button
									onPress={this.upvote.bind(this)}
									style={{ width: 80, height: 27, marginRight: 2 }}
									textStyle={{ paddingTop: 10, paddingBottom: 10 }}
								>
									Upvote!
								</Button>
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
