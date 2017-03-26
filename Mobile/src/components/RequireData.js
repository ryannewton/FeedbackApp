// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import Scenes and action creators
import Loading from '../scenes/Loading';

export default function (ComposedComponent) {
  class RequireData extends Component {
    render() {
      // If data has loaded, return the original component
      if (this.props.projectsLoaded) {
        return <ComposedComponent {...this.props} />;
      }
      // Otherwise, show a Loading screen
      return <Loading />;
    }
  }

  RequireData.propTypes = {
    projectsLoaded: React.PropTypes.bool,
  };

  function mapStateToProps(state) {
    const { projectsLoaded } = state.main;
    return { projectsLoaded };
  }

  return connect(mapStateToProps)(RequireData);
}
