'use strict';

//Import Libraries
import React, { Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

//Import componenets, functions, and styles
//import Button from '../components/button.js';
import ProjectDetails from '../scenes/project_details.js';
import styles from '../styles/styles_main.js';
import { Button } from './common';

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

	render() {
			return (
				<TouchableHighlight
					style={styles.row}
					underlayColor='#D0D0D0'
					onPress={this.goToDetails}
				>
					<View style={styles.project}>

						{/* Add description of Text content */}
						<Text style={[styles.buttonText, styles.low_weight]}>
							{this.props.item.votes} Votes: 
						</Text>

						{/* Add description of Text content */}
						<Text style={styles.buttonText}>
							{this.props.item.title}
						</Text>

						{/* Button for upvoting a piece of feedback */}
						<View>
							<Button	onPress={this.upvote}>
								"Up Vote!"
							</Button>
						</View>
					</View>
				</TouchableHighlight>
			);
	}
}

export default Project;
