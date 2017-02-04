'use strict';

//Import Libraries
import React, { Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

//Import componenets, functions, and styles
//import Button from '../components/button.js';
import ProjectDetails from '../scenes/project_details.js';
import styles from '../styles/styles_main.js';
import { Button, Card } from './common';

class Project extends Component {
	constructor(props) {
		super(props);

		this.goToDetails = this.goToDetails.bind(this);
		this.upvote = this.upvote.bind(this);
	}

	goToDetails() {
		//const route = {key: 'ProjectDetails', item: this.props.item, component: ProjectDetails};
		//this.props.navigate({type: 'push', route});
	}

	upvote() {
		const newProject = { ...this.props.item, votes: this.props.item.votes + 1 };
		this.props.saveProjectChanges(newProject);
	}

	// Temporary fix. Async issue is causing this.props.item to be temporarily undefined
	renderVoteCount() {
		if (this.props.item === undefined) {
			return '';
		}
		return `${this.props.item.votes} Votes`;
	}

	// Temporary fix. Async issue is causing this.props.item to be temporarily undefined
	renderTitle() {
		if (this.props.item === undefined) {
			return '';
		}
		return this.props.item.title;
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
								<Button	onPress={this.upvote} style={{ width: 80, height: 27, marginRight: 2 }}>
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

export default Project;
