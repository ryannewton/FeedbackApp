// Import Libraries
import React, { Component } from 'react';
import { View, ListView } from 'react-native';
import { connect } from 'react-redux';

// Import actions
import { saveProjectChanges } from '../actions';

// Import components, functions, and styles
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.projects !== this.props.projects) {
      const newProjectsList = nextProps.projects.slice();
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(newProjectsList),
      });
    }
  }

  renderProjects() {
    const projects = this.props.projects
      .map((project, index) => (
        <Project
          project={project}
          key={index}
          navigate={this.props.navigation.navigate}
          saveProjectChanges={this.props.saveProjectChanges}
        />
      ),
    );

    return projects;
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          enableEmptySections
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
})(Projects);

export default AppScreen;
