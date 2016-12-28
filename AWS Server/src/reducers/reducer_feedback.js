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

export default function feedback(state = [], action) {
  switch (action.type) {
    case 'RECEIVED_FEEDBACK':
      return  ops.insert(0, action.feedback.filter((item) => {return item.text !== "Feedback Submitted!"}), []);
      break;    
    default:
      return state;
  }
}
