// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import Scenes and action creators
import Authorize from '../scenes/authorize';
import SendAuthorizationEmail from '../scenes/sendAuthorizationEmail';

export default function (ComposedComponent) {
  class Authentication extends Component {
    render() {
      // If user is already logged in, return the original component
      if (this.props.loggedIn) {
        return <ComposedComponent {...this.props} />;
      }

      // If the authroization email has been sent, show scene to get auth code
      if (this.props.sentAuthorizationEmail) {
        return <Authorize {...this.props} />;
      }

      // Otherwise, show the sendAuthorizationEmail scene
      return <SendAuthorizationEmail {...this.props} />;
    }
  }

  Authentication.propTypes = {
    loggedIn: React.PropTypes.bool,
    sentAuthorizationEmail: React.PropTypes.bool,
  };

  function mapStateToProps(state) {
    return {
      loggedIn: state.auth.loggedIn,
      sentAuthorizationEmail: state.auth.sentAuthorizationEmail,
    };
  }

  return connect(mapStateToProps)(Authentication);
}
