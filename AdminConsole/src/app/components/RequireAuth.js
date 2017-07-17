import React, { Component } from 'react';
import { connect } from 'react-redux';

import Login from '../containers/Login';

export default function(ComposedComponent) {
  class RequireAuth extends Component {

    componentWillMount() {
      console.log('auth props', this.props);
    }

    render() {
      if (this.props.authenticated) {
        return <ComposedComponent {...this.props} />;
      }
      return <Login />;
    }
  }

  function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
  }

  return connect(mapStateToProps)(RequireAuth);
}
