'use strict';

// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import Scenes and action creators
import Authorize from '../scenes/authorize.js';
import SendAuthorizationEmail from '../scenes/sendAuthorizationEmail.js';

export default function (ComposedComponent) {
	class Authentication extends Component {

		render() {
			if (loggedIn) {
				return <ComposedComponent {...this.props} />;
			} else if (sentAuthorizationEmail) {
				return <Authorize {...this.props} />
			} else {
				return <SendAuthorizationEmail {...this.props} />;
			}
		}
	}

	function mapStateToProps(state) {
		return { 
			sentAuthorizationEmail: state.auth.sentAuthorizationEmail,
		};
	}

	return connect(mapStateToProps)(Authentication);
}
