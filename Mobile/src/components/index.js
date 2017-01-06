'use strict';

//Import libaries
import React, { Component } from 'react';

//Import components, functions, and styles
import Navigator from './Navigation/Navigator.js';
import {updateAppNavigationState} from './Navigation/Navigation_Functions.js';
import {createAppNavigationState} from './Navigation/Navigation_Functions.js';

// Defines a high-level (container) component
export default class Index extends Component {

	constructor(props, context) {
		super(props, context);

		// This sets up the initial navigation state.
		this.state = createAppNavigationState();

		this._navigate = this._navigate.bind(this);
	}

	render(): React.Element {
		return (
			<Navigator
				appNavigationState={this.state}
				navigate={this._navigate}
			/>
		);
	}  

	_navigate(action: Object): void {
		const state = updateAppNavigationState(this.state, action);

		if (this.state !== state) {
			this.setState(state);
		}
	}
}


