'use strict';

//Import libraries
import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import actions
import * as actions from '../actions';

//Import components, functions, and styles
import RequireAuth from '../components/require_auth';
import Project from '../components/project.js';
import { Header } from '../components/common';
import styles from '../styles/styles_main.js';

class Projects extends Component {
	constructor(props) {
		super(props);
		
		console.log('projects props');
		console.log(props);
	}

	compareNumbers(a, b) {
		return b.votes - a.votes;
	}

	renderProjects() {
		const projects = this.props.projects.sort(this.compareNumbers).map((project, index) => {
			return (
				<Project
					project={project}
					key={index}
					navigate={this.props.navigate}
					saveProjectChanges={this.props.saveProjectChanges}
				/>
			);
		});
		
		return projects;
	}

	render() {
		return (
			<View style={styles.container}>

				<Header>
					Projects
				</Header>

				{/* List of projects */}
				<ScrollView>
					{this.renderProjects()}
				</ScrollView>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return state;
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RequireAuth(Projects, 'Projects'));
