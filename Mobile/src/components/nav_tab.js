'use strict';

//Import libaries
import React, {Component, PropTypes} from 'react';
import {Text, TouchableOpacity} from 'react-native';

//Import components, functions, and styles
import styles from '../styles/styles_main.js'; 

class Nav_Tab extends Component {

	constructor(props: Object, context: any) {
		super(props, context);
		this._onPress = this._onPress.bind(this);
	}

	render() {
		let style = [styles.tabText];
		if (this.props.selected) {
			style.push(styles.tabSelected);
		}
		return (
			<TouchableOpacity style={styles.tab} onPress={this._onPress}>
				<Text style={style}>
					{this.props.route.key}
				</Text>
			</TouchableOpacity>
		);
	}

	_onPress() {
		this.props.navigate({type: 'selectTab', tabKey: this.props.route.key});
	}
}

export default Nav_Tab;