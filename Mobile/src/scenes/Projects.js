// Import Libraries
import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';

// Import actions
import { saveProjectChanges } from '../actions';

// Import components, functions, and styles
import RequireAuth from '../components/require_auth';
import Project from '../components/project';
import styles from '../styles/styles_main';

class Projects extends Component {
  compareNumbers(a, b) {
    return b.votes - a.votes;
  }

  renderProjects() {
    const projects = this.props.projects.slice(0,5).sort(this.compareNumbers).map((project, index) => {
      return (
        <Project
          project={project}
          key={index}
          navigate={this.props.navigation.navigate}
          saveProjectChanges={this.props.saveProjectChanges}
        />
      );
    });

    return projects;
  }

  render() {
    return (
      <View style={styles.container}>

        {/* List of projects */}
        <ScrollView>
          {this.renderProjects()}
        </ScrollView>
      </View>
    );
  }
}

Projects.propTypes = {
  navigation: React.PropTypes.object,
  projects: React.PropTypes.array,
  saveProjectChanges: React.PropTypes.func,
};

function mapStateToProps(state) {
  const { projects } = state;
  return { projects };
}

const AppScreen = connect(mapStateToProps, {
  saveProjectChanges,
})(RequireAuth(Projects));

AppScreen.navigationOptions = {
  title: 'Projects',
};

export default AppScreen;
