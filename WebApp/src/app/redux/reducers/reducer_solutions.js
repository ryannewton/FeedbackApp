// Import action types
import {
  REQUEST_SOLUTIONS,
  REQUEST_SOLUTIONS_SUCCESS,
  REQUEST_SOLUTIONS_FAIL,
  SIGNOUT_USER,
  ADD_SOLUTION_TO_STATE,
} from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  list: [],
  lastPulled: new Date(0),
  error: false,
};

function filterAndOrder(list) {
  const result = list
    .filter(item => item.stage !== 'tabled')
    .sort((a, b) => b.id - a.id)
    .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
  return result;
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUEST_SOLUTIONS:
      return { ...state, loading: true };
    case REQUEST_SOLUTIONS_SUCCESS: {
      const list = filterAndOrder(action.payload.list);
      return { ...state, list, lastPulled: action.payload.lastPulled, loading: false, error: false };
    }
    case ADD_SOLUTION_TO_STATE:
      return { ...state, list:[...state.list, action.payload]}
    case REQUEST_SOLUTIONS_FAIL:
      return { ...state, loading: false, error: true };
    case SIGNOUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};
