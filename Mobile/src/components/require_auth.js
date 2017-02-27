'use strict';

// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import Scenes and action creators
import Signup from '../scenes/signup';
import { navigate } from '../actions';

export default function (ComposedComponent) {
	class Authentication extends Component {
		// Gives access to this.context.router
		static contextTypes = {
			router: React.PropTypes.object
		}

		componentWillMount() {
			// If user is not authenticated, navigate to /signin
			if (!this.props.token) {
				const scene = { key: 'Signup', component: Signup };
				const route = { type: 'push', route: scene };
				this.props.navigate(route);
			}
		}

		render() {
			return <ComposedComponent {...this.props} />;
		}
	}

	function mapStateToProps(state) {
		return { token: state.auth.token };
	}

	return connect(mapStateToProps, { navigate })(Authentication);
}
