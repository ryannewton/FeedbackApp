'use strict';

//Import libaries
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import firebase from 'firebase';

//Import API keys
import firebaseConfig from '../../api_keys.js';

//Import Store
import store from '../reducers/store.js';

//Import components, functions, and styles
import Container from './container.js';

// Defines a high-level (container) component
export default class Index extends Component {
	componentWillMount() {
		firebase.initializeApp(firebaseConfig);
	}

	render() {
		return (
			<Provider store={store}>
				<Container />
			</Provider>
		);
	}
}
