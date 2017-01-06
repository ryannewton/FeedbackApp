'use strict';

//Import libaries
import React, {Component, PropTypes} from 'react';
import {NavigationExperimental, Text, TouchableOpacity} from 'react-native';

const {
	PropTypes: NavigationPropTypes,
} = NavigationExperimental;

//Import components, functions, and styles
import {createAppNavigationContainer} from './Navigation_Functions.js';
import styles from '../../styles/styles_main.js'; 

const Nav_Tab = createAppNavigationContainer(class extends Component {

	static propTypes = {
		navigate: PropTypes.func.isRequired,
		route: NavigationPropTypes.navigationRoute.isRequired,
		selected: PropTypes.bool.isRequired,
	};

	constructor(props: Object, context: any) {
		super(props, context);
		this._onPress = this._onPress.bind(this);
	}

	render(): React.Element {
		const style = [styles.tabText];
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
});

export default Nav_Tab;