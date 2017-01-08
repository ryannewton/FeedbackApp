'use strict';

//Import Libraries
import React, { Component } from 'react';
import {
	View,
	Button,
	Text,
	TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import Actions
import Actions from '../actions/actions.js';

//Import componenets, functions, and styles
import styles from '../styles/styles_main.js';

class Project_Details extends Component {
	constructor(props) {
		super(props);
	}

	on_back() {

	}

	up_vote() {

	}

	render() {
			return (
				<View style={styles.project}>
					<Text style={[styles.buttonText, styles.low_weight]}>
						{this.props.item.votes} Votes: 
					</Text>
					<Text style={styles.buttonText}>
						{this.props.item.title}
					</Text>
					<View style={styles.buttonAlign}>
						<Button
							onPress={this.up_vote}          
							title="Up Vote!"
							style={styles.up_vote_button}
						/>
					</View>
				</View>
			);
	}
}

function mapStateToProps(state) {
	return state;
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Project_Details);
