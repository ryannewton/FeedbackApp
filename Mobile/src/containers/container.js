'use strict';

//Import libaries
import React, { Component } from 'react';
import { NavigationExperimental, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import Actions
import Actions from '../actions';

//Import components, functions, and styles
import NavTabs from '../components/nav_tabs.js';
import styles from '../styles/styles_main.js';

const { CardStack: NavigationCardStack } = NavigationExperimental;

class Container extends Component {

	constructor(props: any, context: any) {
		super(props, context);

		this._renderScene = this._renderScene.bind(this);
	}

	_renderScene(sceneProps: Object): React.Element {
		return React.createElement(sceneProps.scene.route.component, { ...sceneProps });
	}

	render(): React.Element {
		// Add comment describing these variables
		const { tabs } = this.props.navigation;
		const tabKey = tabs.routes[tabs.index].key;
		const scenes = this.props.navigation[tabKey];

		return (
			<View style={styles.navigator}>
				<NavigationCardStack
					key={`stack_ ${tabKey}`}
					navigationState={scenes}
					renderScene={this._renderScene}
					style={styles.navigatorCardStack}					
				/>
				<NavTabs
					navigationState={tabs}
					navigate={this.props.navigate}
				/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Container);
