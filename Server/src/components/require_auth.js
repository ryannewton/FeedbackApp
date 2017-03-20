'use strict';

// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import Scenes and action creators
import Authorize from './authorize.js';

export default function (ComposedComponent) {
	class Authentication extends Component {
		render() {
			if (this.props.loggedIn) {
				return <ComposedComponent {...this.props} />;
			} else {
				return <Authorize {...this.props} />
			}
		}
	}

	function mapStateToProps(state) {
		return { 
			loggedIn: state.auth.loggedIn
		};
	}

	return connect(mapStateToProps)(Authentication);
}
