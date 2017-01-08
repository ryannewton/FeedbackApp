'use strict';

//Import Libraries
import React, { Component } from 'react';
import {
	View,
	Button,
	Text,
	TouchableHighlight,
} from 'react-native';

//Import componenets, functions, and styles
import Project_Details from '../scenes/project_details.js';
import styles from '../styles/styles_main.js';

class Project extends Component {
	constructor(props) {
		super(props);

		this.onPress = this.onPress.bind(this);
	}

	onPress() {
		const route = {key: 'Project_Details', item: this.props.item, component: Project_Detail};
		this.props.navigate({type: 'push', route});
	}

	render() {
			return (
				<TouchableHighlight
					style={styles.row}
					underlayColor="#D0D0D0"
					onPress={this.onPress}>
					<View style={styles.project}>
						<Text style={[styles.buttonText, styles.low_weight]}>
							{this.props.item.votes} Votes: 
						</Text>
						<Text style={styles.buttonText}>
							{this.props.item.title}
						</Text>
						<View style={styles.buttonAlign}>
							<Button
								onPress={this.onPress}          
								title="Up Vote!"
								style={styles.up_vote_button}
							/>
						</View>
					</View>
				</TouchableHighlight>
			);
	}
}

export default Project;