import React, { Component } from 'react';
import { connect } from 'react-redux';

import Login from './Login';
import Loading from './Loading';

export default function(ComposedComponent) {
  class RequireAuth extends Component {
    render() {
      // First check to see if authenticated failed (it starts off as null)
      if (this.props.authenticated === false) return <Login />;

      // If not, then check to see if authenticated is true
      if (
        this.props.authenticated &&
        this.props.groupLoaded !== null
      )
        return <ComposedComponent {...this.props} />;

      // If neither, we must still be loading
      return <Loading />;
    }
  }

  function mapStateToProps(state) {
    return {
      authenticated: state.auth.authenticated,
      groupLoaded: state.group.includePositiveFeedbackBox,
    };
  }

  return connect(mapStateToProps)(RequireAuth);
}
