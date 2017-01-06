'use strict';

//Import libraries
import React, { Component } from 'react';
import {
	Text,
	View,
} from 'react-native';

//Import components, functions, and styles
import Submitted from './submitted.js';
import {createAppNavigationContainer} from '../Navigation/Navigation_Functions.js';
import styles from '../../styles/styles_main.js'; 

const Projects = createAppNavigationContainer(class extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					Projects
				</Text>
			</View>
		);
	}
});

export default Projects;
