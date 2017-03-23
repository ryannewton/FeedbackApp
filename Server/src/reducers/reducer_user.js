// Import action types
import {
  ADD_PROJECT_UPVOTE,
  REMOVE_PROJECT_UPVOTE,
  LOAD_PROJECT_UPVOTES,
  LOAD_SOLUTION_UPVOTES,
  ADD_SOLUTION_UPVOTE,
  REMOVE_SOLUTION_UPVOTE,
} from '../actions/types';

const INITIAL_STATE = {
  projectUpvotes: [],
  solutionUpvotes: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_PROJECT_UPVOTE:
      return { ...state, projectUpvotes: [...state.projectUpvotes, action.payload.id] };
    case ADD_SOLUTION_UPVOTE:
      return { ...state, solutionUpvotes: [...state.solutionUpvotes, action.payload.id] };
    case REMOVE_PROJECT_UPVOTE:
      return { ...state, projectUpvotes: removeItem(state.projectUpvotes, action.payload.id) };
    case REMOVE_SOLUTION_UPVOTE:
      return { ...state, solutionUpvotes: removeItem(state.solutionUpvotes, action.payload.id) };
    case LOAD_PROJECT_UPVOTES:
      return { ...state, projectUpvotes: action.payload };
    case LOAD_SOLUTION_UPVOTES:
      return { ...state, solutionUpvotes: action.payload };
    default:
      return state;
  }
};

const removeItem = (arr, item) => {
  const index = arr.indexOf(item);
  if (index !== -1) {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  }
  return arr;
};
