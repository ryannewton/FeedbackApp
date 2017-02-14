import React, { Component } from 'react';
import Index from './src/containers/index.js';

import {
	AppRegistry,
} from 'react-native';

export default class FeedbackApp extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Index />
		);
	}
}

AppRegistry.registerComponent('FeedbackApp', () => FeedbackApp);
