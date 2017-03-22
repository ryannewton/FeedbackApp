//Import Libraries
import compose from 'ramda/src/compose';
import ops from 'immutable-ops';

// These are all the available functions.
const {
    // Functions operating on objects.
    merge,
    mergeDeep,
    omit,
    setIn,

    // Functions operating on arrays.
    insert,
    splice,
    push,
    filter,

    // Functions operating on both
    set,

    // Placeholder for currying.
    __,
} = ops;


export default function upVotes(state = [], action) {
  switch (action.type) {
    case 'SET_UP_VOTES':
    	return ops.push(action.upVotes, state);
    	break;
    case 'ADD_UP_VOTE':
      localStorage.setItem('upVotes', JSON.stringify(ops.push(action.upVote, state)));
      return ops.push(action.upVote, state);
      break;
    case 'REMOVE_UP_VOTE':
      localStorage.setItem('upVotes', JSON.stringify((ops.filter((id) => { return id !== action.upVote; }, state))));
      return ops.filter((id) => { return id !== action.upVote; }, state);
      break;   
    default:
      return state;
  }
}

