// Import action types
import {
  REQUEST_SOLUTIONS,
  REQUEST_SOLUTIONS_SUCCESS,
  REQUEST_SOLUTIONS_FAIL,
  APPROVE_SOLUTION_SUCCESS,
  CLARIFY_SOLUTION_SUCCESS,
  SIGNOUT_USER,
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
  let index;
  let newList;
  switch (action.type) {
    case REQUEST_SOLUTIONS:
      return { ...state, loading: true };
    case REQUEST_SOLUTIONS_SUCCESS:
      return { ...state, list: filterAndOrder(action.payload.list), lastPulled: action.payload.lastPulled, loading: false, error: false };
    case REQUEST_SOLUTIONS_FAIL:
      return { ...state, loading: false, error: true };
    case APPROVE_SOLUTION_SUCCESS:
      index = state.list.findIndex(item => item.id === action.payload.id);
      newList = state.list.slice(0);
      newList[index].approved = 1;
      return { ...state, list: newList };
    case CLARIFY_SOLUTION_SUCCESS:
      index = state.list.findIndex(item => item.id === action.payload.id);
      newList = state.list.slice(0);
      newList[index].approved = 0;
      newList[index].status = 'clarify';
      return { ...state, list: newList };
    case SIGNOUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};
