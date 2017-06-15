// Import action types
import {
  ADD_PROJECT_UPVOTE,
  REMOVE_PROJECT_UPVOTE,
  LOAD_PROJECT_UPVOTES,
  LOAD_SOLUTION_UPVOTES,
  ADD_SOLUTION_UPVOTE,
  REMOVE_SOLUTION_UPVOTE,
  ADD_SOLUTION_DOWNVOTE,
  REMOVE_SOLUTION_DOWNVOTE,
  LOAD_SOLUTION_DOWNVOTES,
} from '../actions/types';

const INITIAL_STATE = {
  projectUpvotes: null,
  solutionUpvotes: null,
  solutionDownvotes: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_PROJECT_UPVOTE:
      localStorage.setItem('projectUpvotes', JSON.stringify([...state.projectUpvotes, action.payload.id]));
      return { ...state, projectUpvotes: [...state.projectUpvotes, action.payload.id] };
    case ADD_SOLUTION_UPVOTE:
      localStorage.setItem('solutionUpvotes', JSON.stringify([...state.solutionUpvotes, action.payload.id]));
      return { ...state, solutionUpvotes: [...state.solutionUpvotes, action.payload.id] };
    case ADD_SOLUTION_DOWNVOTE:
      localStorage.setItem('solutionDownvotes', JSON.stringify([...state.solutionDownvotes, action.payload.id]));
      return { ...state, solutionDownvotes: [...state.solutionDownvotes, action.payload.id] };
    case REMOVE_PROJECT_UPVOTE:
      localStorage.setItem('projectUpvotes', JSON.stringify(removeItem(state.projectUpvotes, action.payload.id)));
      return { ...state, projectUpvotes: removeItem(state.projectUpvotes, action.payload.id) };
    case REMOVE_SOLUTION_UPVOTE:
      localStorage.setItem('solutionUpvotes', JSON.stringify(removeItem(state.solutionUpvotes, action.payload.id)));
      return { ...state, solutionUpvotes: removeItem(state.solutionUpvotes, action.payload.id) };
    case REMOVE_SOLUTION_DOWNVOTE:
      localStorage.setItem('solutionDownvotes', JSON.stringify(removeItem(state.solutionDownvotes, action.payload.id)));
      return { ...state, solutionDownvotes: removeItem(state.solutionDownvotes, action.payload.id) };
    case LOAD_PROJECT_UPVOTES:
      return { ...state, projectUpvotes: action.payload };
    case LOAD_SOLUTION_UPVOTES:
      return { ...state, solutionUpvotes: action.payload };
    case LOAD_SOLUTION_DOWNVOTES:
      return { ...state, solutionDownvotes: action.payload };
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
