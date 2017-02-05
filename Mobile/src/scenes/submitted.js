'use strict';

//Import Libaries
import React, { Component } from 'react';
import { View, BackAndroid } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import actions
import * as actions from '../actions';

//Import components, functions, and styles
import { Button, Header } from '../components/common';
import styles from '../styles/styles_main.js';

class Submitted extends Component {
	constructor(props: Object, context: any) {
		super(props, context);

		BackAndroid.addEventListener('hardwareBackPress', () => {
			props.navigate({ type: 'pop' });
			return true;
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<Header>
					You Submitted Feedback
				</Header>

				<View style={{ flex: 1, paddingTop: 20 }}>
					<Button	onPress={() => this.props.navigate({ type: 'pop' })}>
						Submit More Feedback
					</Button>
				</View>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return state;
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Submitted);
