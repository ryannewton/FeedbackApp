'use strict';

//Import Libraries
import { NavigationExperimental } from 'react-native';

// Import action types
import { UPDATE_NAV_STATE } from '../actions/types';

const {
	StateUtils: NavigationStateUtils,
} = NavigationExperimental;

export default function navigation(state = {}, action) {
	// Defines pop, push, pop-push, and select-tab navigation types
	function updateNavState(action, state) {

		switch (action.type) {
			case 'push': {
				// Push a route into the scenes stack.
				const route: Object = action.route;
				const { tabs } = state;
				const tabKey = tabs.routes[tabs.index].key;
				const scenes = state[tabKey];
				const nextScenes = NavigationStateUtils.push(scenes, route);
				if (scenes !== nextScenes) {
					return { ...state, [tabKey]: nextScenes };
				}
				break;
			}

			case 'pop': {
				// Pops a route from the scenes stack.
				const { tabs } = state;
				const tabKey = tabs.routes[tabs.index].key;
				const scenes = state[tabKey];
				const nextScenes = NavigationStateUtils.pop(scenes);
				if (scenes !== nextScenes) {
					return { ...state, [tabKey]: nextScenes	};
				}
				break;
			}

			case 'pop-push': {
				// Pops a route from the scenes stack.
				const route: Object = action.route;
				const { tabs } = state;
				const tabKey = tabs.routes[tabs.index].key;
				const scenes = state[tabKey];
				const nextScenes = NavigationStateUtils.pop(scenes);
				const finalScenes = NavigationStateUtils.push(nextScenes, route);

				if (scenes !== finalScenes) {
					return { ...state, [tabKey]: finalScenes };
				}
				break;
			}

			case 'selectTab': {
				// Switches the tab
				const tabKey: string = action.tabKey;
				const tabs = NavigationStateUtils.jumpTo(state.tabs, tabKey);
				if (tabs !== state.tabs) {
					return { ...state, tabs	};
				}
				break;
			}

			default:
				return state;
		}
	}

	switch (action.type) {
		case UPDATE_NAV_STATE:
			return updateNavState(action.payload, state);
		default:
			return state;
	}
}
