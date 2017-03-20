'use strict';

//Import Libraries
import { NavigationExperimental } from 'react-native';

// Import action types
import { UPDATE_NAV_STATE } from '../actions/types';

const {
	StateUtils: NavigationStateUtils,
} = NavigationExperimental;

//Import Components
import Feedback from '../scenes/feedback.js';
import ProjectsTab from '../scenes/projectsTab.js';
import Settings from '../scenes/settings.js';
import New_Projects from '../scenes/new_projects.js';
import Welcome from '../scenes/welcome';

//Sets our initial state (before data is pulled from the server)
const INITIAL_STATE = {
	tabs: {
		index: 4,
		routes: [
			{key: 'Feedback', displayName: 'Send Feedback', inTabs: true},
			{key: 'NewProjects', displayName: 'New Projects', inTabs: true},
			{key: 'AllProjects', displayName: 'All Projects', inTabs: true},
			{key: 'Settings', displayName: 'Settings', inTabs: false},
			{key: 'Welcome', displayName: 'Welcome', inTabs: false}
		],
	},
	// Scenes for the `Feedback` tab.
	Feedback: {
		index: 0,
		routes: [{key: 'Feedback Home', component: Feedback }],
	},
	// Scenes for the `ProjectsTab` tab.
	AllProjects: {
		index: 0,
		routes: [{key: 'Projects Home', component: ProjectsTab }],
	},
	// Scenes for the `Settings` tab.
	Settings: {
		index: 0,
		routes: [{key: 'Settings Home', component: Settings }],
	},
	// Scenes for the 'New Projects' tab.
	NewProjects: {
		index: 0,
		routes: [{key: 'New Projects Home', component: New_Projects }],
	},
	Welcome: {
		index: 0,
		routes: [{key: 'Welcome Home', component: Welcome }]
	}
};

export default (state = INITIAL_STATE, action) => {
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
				} else {
					return state;
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
};
