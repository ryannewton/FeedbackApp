// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import Scenes and action creators
import Authorize from './Authorize';
import WelcomeScreen from './WelcomeScreen';

export default function (ComposedComponent) {
  class Authentication extends Component {
    render() {
      if (this.props.loginFailed) {
        return <Authorize />;
      } else if (this.props.projects && this.props.projectAdditions && this.props.projectUpvotes) {
        return <ComposedComponent {...this.props} />;
      } else {
        return <WelcomeScreen />;
      }
    }
  }

  function mapStateToProps(state) {
    return {
      loginFailed: state.auth.loginFailed,
      projects: state.projects,
      projectAdditions: state.projectAdditions,
      projectUpvotes: state.user.projectUpvotes,
    };
  }

  return connect(mapStateToProps)(Authentication);
}
