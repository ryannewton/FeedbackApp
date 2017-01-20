'use strict';

//Import Libraries
import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableHighlight,
} from 'react-native';

//Import componenets, functions, and styles
import Button from '../components/button.js';
import Project_Details from '../scenes/project_details.js';
import styles from '../styles/styles_main.js';

class Project extends Component {
	constructor(props) {
		super(props);

		this.go_to_details = this.go_to_details.bind(this);
		this.up_vote = this.up_vote.bind(this);
	}

	go_to_details() {
		//const route = {key: 'Project_Details', item: this.props.item, component: Project_Details};
		//this.props.navigate({type: 'push', route});
	}

	up_vote() {
		let new_project = Object.assign({}, this.props.item, {votes: this.props.item.votes + 1});
		this.props.saveProjectChanges(new_project);
	}

	render() {
			return (
				<TouchableHighlight
					style={styles.row}
					underlayColor="#D0D0D0"
					onPress={this.go_to_details}>
					<View style={styles.project}>
						<Text style={[styles.buttonText, styles.low_weight]}>
							{this.props.item.votes} Votes: 
						</Text>
						<Text style={styles.buttonText}>
							{this.props.item.title}
						</Text>
						<View style={styles.buttonAlign}>
							<Button
								onPress={this.up_vote}          
								text="Up Vote!"
							/>
						</View>
					</View>
				</TouchableHighlight>
			);
	}
}

export default Project;