'use strict';

//Import libraries
import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';

//Import actions
import { navigate, saveProjectChanges } from '../actions';

//Import components, functions, and styles
import RequireAuth from '../components/require_auth';
import Project from '../components/project.js';
import { Header } from '../components/common';
import styles from '../styles/styles_main.js';

class Projects extends Component {
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
	const { projects } = state;
	return { projects };
}

export default connect(mapStateToProps, {
	navigate,
	saveProjectChanges
})(RequireAuth(Projects));
