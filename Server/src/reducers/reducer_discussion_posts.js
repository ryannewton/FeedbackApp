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

export default function discussion_posts(state = [], action) {
  switch (action.type) {
    case 'REQUESTED_DISCUSSION_POSTS':
      return state;
      break;
    case 'RECEIVED_DISCUSSION_POSTS':
      return ops.insert(0, action.discussion_posts, []);
      break;
    case 'SAVE_DISCUSSION_POST_CHANGES':
      let index = state.findIndex((discussion_post) => {
        return discussion_post.id === action.discussion_post.id;
      });
      return ops.splice(index, 1, action.discussion_post, state);
      break;
    case 'ADD_DISCUSSION_POST':
      return ops.push({id: action.id, title: "Blank Title", description: "Blank Description", votes: 0}, state);
      break;
    case 'DELETE_DISCUSSION_POST':
      return ops.filter((discussion_post) => { return discussion_post.id !== action.id; }, state);
      break;
    default:
      return state;
  }
}
