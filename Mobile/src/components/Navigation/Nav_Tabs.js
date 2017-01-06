'use strict';

//Import Libaries
import React, {Component, PropTypes} from 'react';
import {NavigationExperimental, View} from 'react-native';

const {
	PropTypes: NavigationPropTypes,
} = NavigationExperimental;

//Import components, functions, and styles
import Nav_Tab from './Nav_Tab.js';
import {createAppNavigationContainer} from './Navigation_Functions.js'; 
import styles from '../../styles/styles_main.js';

const Nav_Tabs = createAppNavigationContainer(class extends Component {
	static propTypes = {
		navigationState: NavigationPropTypes.navigationState.isRequired,
		navigate: PropTypes.func.isRequired,
	};

	constructor(props: Object, context: any) {
		super(props, context);
	}

	render(): React.Element {
		return (
			<View style={styles.tabs}>
				{this.props.navigationState.routes.map(this._renderTab, this)}
			</View>
		);
	}

	_renderTab(route: Object, index: number): React.Element {
		return (
			<Nav_Tab
				key={route.key}
				route={route}
				selected={this.props.navigationState.index === index}
			/>
		);
	}
});

export default Nav_Tabs;