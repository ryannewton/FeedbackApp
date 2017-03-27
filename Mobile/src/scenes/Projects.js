// Import Libraries
import React, { Component } from 'react';
import { View, ListView } from 'react-native';
import { connect } from 'react-redux';

// Import actions
import { saveProjectChanges } from '../actions';

// Import components, functions, and styles
import RequireAuth from '../components/RequireAuth';
import Project from '../components/Project';
import styles from '../styles/scenes/ProjectsStyles';

class Projects extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(props.projects),
    };
  }

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

        {/* List of projects
        <ScrollView>
          {this.renderProjects()}
        </ScrollView>
        */}

        <ListView
          dataSource={this.state.dataSource}
          renderRow={rowData =>
            <Project
              project={rowData}
              key={rowData.id}
              navigate={this.props.navigation.navigate}
              saveProjectChanges={this.props.saveProjectChanges}
            />
          }
        />

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
