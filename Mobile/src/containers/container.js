'use strict';

//Import libaries
import React, { Component, PropTypes } from 'react';
import { NavigationExperimental, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const {
	CardStack: NavigationCardStack,
	PropTypes: NavigationPropTypes,
} = NavigationExperimental;

//Import Actions
import Actions from '../actions/actions.js';

//Import components, functions, and styles
import Nav_Tabs from '../components/nav_tabs.js';
import styles from '../styles/styles_main.js';

class Container extends Component {

	constructor(props: any, context: any) {
		super(props, context);

		this._renderScene = this._renderScene.bind(this);

		console.log("Container Props");
		console.log(props);
	}

	render(): React.Element {
		const {tabs} = this.props.navigation;
		const tabKey = tabs.routes[tabs.index].key;
		const scenes = this.props.navigation[tabKey];

		return (
			<View style={styles.navigator}>
				<NavigationCardStack
					key={'stack_' + tabKey}
					navigationState={scenes}
					renderScene={this._renderScene}
					style={styles.navigatorCardStack}					
				/>
				<Nav_Tabs
					navigationState={tabs}
					navigate={this.props.navigate}
				/>
			</View>
		);
	}

	_renderScene(sceneProps: Object): React.Element {
		return React.createElement(sceneProps.scene.route.component, {...sceneProps} );
	}
}

function mapStateToProps(state) {
	return state;
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);