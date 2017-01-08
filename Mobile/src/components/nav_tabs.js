'use strict';

//Import Libaries
import React, {Component} from 'react';
import {View} from 'react-native';

//Import components, functions, and styles
import Nav_Tab from './nav_tab.js';
import styles from '../styles/styles_main.js';

class Nav_Tabs extends Component {

	constructor(props, context) {
		super(props, context);
	}

	render() {
		return (
			<View style={styles.tabs}>
				{this.props.navigationState.routes.map(this._renderTab, this)}
			</View>
		);
	}

	_renderTab(route, index) {
		return (
			<Nav_Tab
				key={route.key}
				route={route}
				selected={this.props.navigationState.index === index}
				navigate={this.props.navigate}
			/>
		);
	}
}

export default Nav_Tabs;