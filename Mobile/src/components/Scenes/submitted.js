'use strict';

//Import Libaries
import React, { Component } from 'react';
import {
	Text,
	View,
	Button,
	BackAndroid
} from 'react-native';

//Import components, functions, and styles
import {createAppNavigationContainer} from '../Navigation/Navigation_Functions.js';
import styles from '../../styles/styles_main.js';

const Submitted = createAppNavigationContainer(class extends Component {
	constructor(props: Object, context: any) {
		super(props, context);

		BackAndroid.addEventListener('hardwareBackPress', function() {
			props.navigate({type: 'pop'});
			return true;
		});

		this._popRoute = this._popRoute.bind(this);    
	}

	_popRoute(): void {
		this.props.navigate({type: 'pop'});
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					You Submitted Feedback
				</Text>
				<Button
					onPress={this._popRoute}
					title="Submit More Feedback"
					style={styles.button}
				/>
			</View>
		);
	}
});

export default Submitted;
