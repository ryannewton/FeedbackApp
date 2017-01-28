'use strict';

export default function projects(state = [], action) {
	switch (action.type) {
		case 'REQUESTED_PROJECTS':
			return state;
		case 'RECEIVED_PROJECTS':
			return action.projects;
		case 'SAVE_PROJECT_CHANGES':
			const index = state.findIndex((project) => project.id === action.project.id);
			const newState = state.slice(0);
			newState.splice(index, 1, action.project);
			return newState;
		case 'ADD_PROJECT':
			return state.splice(state.length-1, 0, {
				id: action.id,
				title: 'Blank Title',
				description: 'Blank Description',
				votes: 0
			});
		case 'DELETE_PROJECT':
			return state.filter((project) => project.id !== action.id);
		default:
			return state;
	}
}
