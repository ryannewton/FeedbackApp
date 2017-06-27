// NOTE: Because state.auth.authenticated is held within the browser, a malicious user could manipulate it
//  For this reason, this higher order component is intended to provide expected behavior
//  (i.e. reroutes to /signin when a user clicks on a protected feature)
// Data is protected from malicious users on the server, which validates a users token before delivering protected data 

import React, { Component } from 'react';
import { connect } from 'react-redux';

export default function(ComposedComponent) {
  class Authentication extends Component {
    // Gives access to this.context.router
    static contextTypes = {
      router: React.PropTypes.object
    }

    componentWillMount() {
      // If user is not authenticated, navigate to /signin
      if(!this.props.authenticated) {
        this.context.router.push('/signin');
      }
    }

    componentWillUpdate(nextProps) {
      // If user signs out, route to home route
      if(!nextProps.authenticated) {
        this.context.router.push('/');
      }
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
  }

  return connect(mapStateToProps)(Authentication);
}
