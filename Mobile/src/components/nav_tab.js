'use strict';

//Import libaries
import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';

//Import components, functions, and styles
import styles from '../styles/styles_main.js'; 

class NavTab extends Component {

	constructor(props: Object, context: any) {
		super(props, context);
		this._onPress = this._onPress.bind(this);
	}

	_onPress() {
		this.props.navigate({ type: 'selectTab', tabKey: this.props.route.key });
	}

	render() {
		const style = [styles.tabText];
		if (this.props.selected) {
			style.push(styles.tabSelected);
		}
		return (
			<TouchableOpacity style={styles.tab} onPress={this._onPress}>
				<Text style={style}>
					{this.props.route.displayName}
				</Text>
			</TouchableOpacity>
		);
	}
}

export default NavTab;
