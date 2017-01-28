'use strict';

export default function up_votes(state = [], action) {
	switch (action.type) {
		case 'SET_UP_VOTES':
			return action.up_votes;
		case 'ADD_UP_VOTE':
			return state.splice(state.length-1, 0, action.up_vote);
		case 'REMOVE_UP_VOTE':      
			return state.filter((id) => id !== action.upVote);
		default:
			return state;
	}
}
