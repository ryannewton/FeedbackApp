// Import action types
import {
  PULL_GROUP_INFO,
  LOAD_DO_NOT_DISPLAY_LIST,
  LOAD_INSTRUCTIONS_VIEWED,
  LOAD_SUGGESTION_UPVOTES,
  LOAD_SUGGESTION_DOWNVOTES,
  LOAD_SOLUTION_UPVOTES,
  LOAD_SOLUTION_DOWNVOTES,
  ADD_TO_DO_NOT_DISPLAY_LIST,
  ADD_TO_INSTRUCTIONS_VIEWED,
  ADD_SUGGESTION_UPVOTE,
  ADD_SUGGESTION_DOWNVOTE,
  ADD_SOLUTION_UPVOTE,
  ADD_SOLUTION_DOWNVOTE,
  REMOVE_SUGGESTION_UPVOTE,
  REMOVE_SUGGESTION_DOWNVOTE,
  REMOVE_SOLUTION_UPVOTE,
  REMOVE_SOLUTION_DOWNVOTE,
  LOG_OUT_USER,
} from '../actions/types';

const INITIAL_STATE = {
  userId: 0,
  doNotDisplayList: [],
  instructionsViewed: [],
  suggestionUpvotes: [],
  suggestionDownvotes: [],
  solutionUpvotes: [],
  solutionDownvotes: [],
};

const removeItem = (arr, item) => {
  const index = arr.indexOf(item);
  if (index !== -1) {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  }
  return arr;
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PULL_GROUP_INFO:
      return { ...state, userId: action.payload.userId };
    case LOAD_DO_NOT_DISPLAY_LIST:
      return { ...state, doNotDisplayList: action.payload };
    case LOAD_INSTRUCTIONS_VIEWED:
      return { ...state, instructionsViewed: action.payload };
    case LOAD_SUGGESTION_UPVOTES:
      return { ...state, suggestionUpvotes: action.payload };
    case LOAD_SUGGESTION_DOWNVOTES:
      return { ...state, suggestionDownvotes: action.payload };
    case LOAD_SOLUTION_UPVOTES:
      return { ...state, solutionUpvotes: action.payload };
    case LOAD_SOLUTION_DOWNVOTES:
      return { ...state, solutionDownvotes: action.payload };

    case ADD_TO_DO_NOT_DISPLAY_LIST:
      return { ...state, doNotDisplayList: [...state.doNotDisplayList, action.payload] };
    case ADD_TO_INSTRUCTIONS_VIEWED:
      return { ...state, instructionsViewed: [...state.instructionsViewed, action.payload] };
    case ADD_SUGGESTION_UPVOTE:
      return { ...state, suggestionUpvotes: [...state.suggestionUpvotes, action.payload.id] };
    case ADD_SUGGESTION_DOWNVOTE:
      return { ...state, suggestionDownvotes: [...state.suggestionDownvotes, action.payload.id] };
    case ADD_SOLUTION_UPVOTE:
      return { ...state, solutionUpvotes: [...state.solutionUpvotes, action.payload.id] };
    case ADD_SOLUTION_DOWNVOTE:
      return { ...state, solutionDownvotes: [...state.solutionDownvotes, action.payload.id] };
    
    case REMOVE_SUGGESTION_UPVOTE:
      return { ...state, suggestionUpvotes: removeItem(state.suggestionUpvotes, action.payload.id) };
    case REMOVE_SUGGESTION_DOWNVOTE:
      return { ...state, suggestionDownvotes: removeItem(state.suggestionDownvotes, action.payload.id) };    
    case REMOVE_SOLUTION_UPVOTE:
      return { ...state, solutionUpvotes: removeItem(state.solutionUpvotes, action.payload.id) };
    case REMOVE_SOLUTION_DOWNVOTE:
      return { ...state, solutionDownvotes: removeItem(state.solutionDownvotes, action.payload.id) };
    
    case LOG_OUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};
