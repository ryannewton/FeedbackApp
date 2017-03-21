// Import action types
import {
  ADD_UPVOTE,
  REMOVE_UPVOTE,
  LOAD_USER_UPVOTES,
  ADD_SOLUTION_UPVOTE,
  REMOVE_SOLUTION_UPVOTE,
  ADD_TO_DO_NOT_DISPLAY_LIST,
  LOAD_DO_NOT_DISPLAY_LIST,
} from '../actions/types';

const INITIAL_STATE = {
  upvotes: [],
  doNotDisplayList: [],
  solutionUpvotes: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_UPVOTE:
      return { ...state, upvotes: [...state.upvotes, action.payload.id] };
    case REMOVE_UPVOTE:
      return { ...state, upvotes: removeItem(state.upvotes, action.payload.id) };
    case LOAD_USER_UPVOTES:
      return { ...state, upvotes: action.payload };
    case ADD_SOLUTION_UPVOTE:
      return { ...state, solutionUpvotes: [...state.solutionUpvotes, action.payload] };
    case REMOVE_SOLUTION_UPVOTE:
      return { ...state, solutionUpvotes: removeItem(state.solutionUpvotes, action.payload) };
    case ADD_TO_DO_NOT_DISPLAY_LIST:
      return { ...state, doNotDisplayList: [...state.doNotDisplayList, action.payload] };
    case LOAD_DO_NOT_DISPLAY_LIST:
      return { ...state, doNotDisplayList: action.payload };
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
