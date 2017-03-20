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

export default function project_additions(state = [], action) {
  switch (action.type) {
    case 'REQUESTED_PROJECT_ADDITIONS':
      return state;
      break;
    case 'RECEIVED_PROJECT_ADDITIONS':
      return ops.insert(0, action.project_additions, []);
      break;
    case 'SAVE_PROJECT_ADDITION_CHANGES':
      let index = state.findIndex((project_addition) => {
        return project_addition.id === action.project_addition.id;
      });
      return ops.splice(index, 1, action.project_addition, state);
      break;
    case 'ADD_SOLUTION':
      return ops.push({id: action.project_addition_id, type: 'solution', votes_for: 0, votes_against: 0, title: 'Title Here', description: 'Description Here', project_id: action.project_id}, state);
      break;
    case 'DELETE_PROJECT_ADDITION':
      return ops.filter((project_addition) => { return project_addition.id !== action.payload; }, state);
      break;
    default:
      return state;
  }
}
