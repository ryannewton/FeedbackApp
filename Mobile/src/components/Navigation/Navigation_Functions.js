'use strict';

//Import Libraries
import React, {Component, PropTypes} from 'react';
import { NavigationExperimental } from 'react-native';

const {
	StateUtils: NavigationStateUtils,
} = NavigationExperimental;

//Import components, functions, and styles
import Feedback from '../Scenes/feedback.js';
import Projects from '../Scenes/projects.js';
import Settings from '../Scenes/settings.js';

// Define what app navigation state will look like.
export function createAppNavigationState(): Object {
	return  {
		tabs: {
			index: 0,
			routes: [
				{key: 'Feedback'},
				{key: 'Projects'},
				{key: 'Settings'},
			],
		},
		// Scenes for the `Feedback` tab.
		Feedback: {
			index: 0,
			routes: [{key: 'Feedback Home', component: Feedback }],
		},
		// Scenes for the `Projects` tab.
		Projects: {
			index: 0,
			routes: [{key: 'Projects Home', component: Projects }],
		},
		// Scenes for the `Settings` tab.
		Settings: {
			index: 0,
			routes: [{key: 'Settings Home', component: Settings }],
		},
	};
}

// Wrapper which provides the navigate prop to components which need it
export function createAppNavigationContainer(ComponentClass) {
	const key = '_navigate';

	class Container extends Component {
		
		static contextTypes = {
			[key]: PropTypes.func,
		};

		static childContextTypes = {
			[key]: PropTypes.func.isRequired,
		};    

		static propTypes = {
			navigate: PropTypes.func,
		};
		
		getChildContext(): Object {
			return {
				[key]: this.context[key] || this.props.navigate,
			};
		}    

		render(): React.Element {
			const navigate = this.context[key] || this.props.navigate;
			return <ComponentClass {...this.props} navigate={navigate} />;
		}
	}

	return Container;
}

// Defines pop, push, pop-push, and select-tab navigation types
export function updateAppNavigationState(state: Object, action: Object): Object {
	let {type} = action;
	if (type === 'BackAction') {
		type = 'pop';
	}

	switch (type) {
		case 'push': {
			// Push a route into the scenes stack.
			const route: Object = action.route;
			const {tabs} = state;
			const tabKey = tabs.routes[tabs.index].key;
			const scenes = state[tabKey];
			const nextScenes = NavigationStateUtils.push(scenes, route);
			if (scenes !== nextScenes) {
				return {
					...state,
					[tabKey]: nextScenes,
				};
			}
			break;
		}

		case 'pop': {
			// Pops a route from the scenes stack.
			const {tabs} = state;
			const tabKey = tabs.routes[tabs.index].key;
			const scenes = state[tabKey];
			const nextScenes = NavigationStateUtils.pop(scenes);
			if (scenes !== nextScenes) {
				return {
					...state,
					[tabKey]: nextScenes,
				};
			}
			break;
		}

		case 'pop-push': {
			// Pops a route from the scenes stack.
			const route: Object = action.route;
			const {tabs} = state;
			const tabKey = tabs.routes[tabs.index].key;
			const scenes = state[tabKey];
			const nextScenes = NavigationStateUtils.pop(scenes);
			const finalScenes = NavigationStateUtils.push(nextScenes, route);
			if (scenes !== finalScenes) {
				return {
					...state,
					[tabKey]: finalScenes,
				};
			}
			break;
		}

		case 'selectTab': {
			// Switches the tab.
			const tabKey: string = action.tabKey;
			const tabs = NavigationStateUtils.jumpTo(state.tabs, tabKey);
			if (tabs !== state.tabs) {
				return {
					...state,
					tabs,
				};
			}
		}
	}
	return state;
}