//Import libaries
import React, { Component, PropTypes } from 'react';
import { NavigationExperimental, View } from 'react-native';

const {
	CardStack: NavigationCardStack,
	PropTypes: NavigationPropTypes,
} = NavigationExperimental;

//Import components, functions, and styles
import Nav_Tabs from './Nav_Tabs.js';
import {createAppNavigationContainer} from './Navigation_Functions.js';
import styles from '../../styles/styles_main.js';

const Navigator = createAppNavigationContainer(class extends Component {
	static propTypes = {
		appNavigationState: PropTypes.shape({
			Feedback: NavigationPropTypes.navigationState.isRequired,
			Projects: NavigationPropTypes.navigationState.isRequired,
			Settings: NavigationPropTypes.navigationState.isRequired,
			tabs: NavigationPropTypes.navigationState.isRequired,
		}),
		navigate: PropTypes.func.isRequired,
	};

	constructor(props: any, context: any) {
		super(props, context);
		this._back = this._back.bind(this);
		this._renderScene = this._renderScene.bind(this);
	}

	render(): React.Element {
		const {appNavigationState} = this.props;
		const {tabs} = appNavigationState;
		const tabKey = tabs.routes[tabs.index].key;
		const scenes = appNavigationState[tabKey];

		return (
			<View style={styles.navigator}>
				<NavigationCardStack
					key={'stack_' + tabKey}
					onNavigateBack={this._back}
					navigationState={scenes}
					renderScene={this._renderScene}
					style={styles.navigatorCardStack}
				/>
				<Nav_Tabs
					navigationState={tabs}
				/>
			</View>
		);
	}

	_renderScene(sceneProps: Object): React.Element {
		return React.createElement(sceneProps.scene.route.component, {...sceneProps} );
	}

	_back() {
		this.props.navigate({type: 'pop'});
	}

});

export default Navigator;