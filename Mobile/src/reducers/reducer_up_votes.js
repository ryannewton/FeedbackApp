'use strict';

export default function up_votes(state = [], action) {
  switch (action.type) {
    case 'SET_UP_VOTES':
    	return action.up_votes;
    	break;
    case 'ADD_UP_VOTE':
      return state.splice(state.length-1, 0, action.up_vote);
      break;
    case 'REMOVE_UP_VOTE':      
      return state.filter((id) => { return id !== action.upVote; });
      break;   
    default:
      return state;
  }
}

