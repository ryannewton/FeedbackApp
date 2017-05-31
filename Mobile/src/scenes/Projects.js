// Import Libraries
import React, { Component } from 'react';
import { View, ListView, Text } from 'react-native';
import { connect } from 'react-redux';

// Import actions
import { saveProjectChanges } from '../actions';

// Import components, functions, and styles
import Project from '../components/Project';
import styles from '../styles/scenes/ProjectsStyles';

// Import tracking
import { tracker } from '../constants';

class Projects extends Component {
  constructor(props) {
    super(props);    
    
    // this.state = {
    //   dataSource: ds.cloneWithRows(props.projects),
    // };

    tracker.trackScreenViewWithCustomDimensionValues('Projects', { domain: props.features.domain });
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.projects && nextProps.projects !== this.props.projects) {
  //     const newProjectsList = nextProps.projects.slice();
  //     this.setState({
  //       dataSource: this.state.dataSource.cloneWithRows(newProjectsList),
  //     });
  //   }
  // }

  renderProjects() {
    const projects = this.props.projects
      .map(project => (
        <Project
          project={project}
          key={project.id}
          navigate={this.props.navigation.navigate}
          saveProjectChanges={this.props.saveProjectChanges}
        />
      ),
    );

    return projects;
  }

  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    return (
      <View style={styles.container}>
        <ListView
          dataSource={ds.cloneWithRows(this.props.projects)}
          initialListSize={200}
          removeClippedSubviews={false}
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
  features: React.PropTypes.object,
};

function mapStateToProps(state) {
  const { projects, features } = state;
  return { projects, features };
}

const AppScreen = connect(mapStateToProps, {
  saveProjectChanges,
})(Projects);

export default AppScreen;
