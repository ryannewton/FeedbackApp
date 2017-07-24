import {
  PULL_FEEDBACK_VOTES_SUCCESS,
  ADD_FEEDBACK_UPVOTE,
  ADD_FEEDBACK_DOWNVOTE,
  REMOVE_FEEDBACK_UPVOTE,
  REMOVE_FEEDBACK_DOWNVOTE,
  PULL_SOLUTION_VOTES_SUCCESS,
  ADD_SOLUTION_UPVOTE,
  ADD_SOLUTION_DOWNVOTE,
  REMOVE_SOLUTION_UPVOTE,
  REMOVE_SOLUTION_DOWNVOTE,
} from '../actions/types';
const INITIAL_STATE = {
  feedbackUpvotes: [],
  feedbackDownvotes: [],
  solutionUpvotes: [],
  solutionDownvotes: [],
  refreshed: true,
}

const removeItem = (arr, item) => {
  const index = arr.indexOf(item);
  if (index !== -1) {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  }
  return arr;
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PULL_FEEDBACK_VOTES_SUCCESS:
      const feedbackUpvotes = action.payload.map((item) => { if (item.upvote) return item.feedbackId })
        // Remove undefined values
        .filter((item) => (item))
      const feedbackDownvotes = action.payload.map((item) => { if (item.downvote) return item.feedbackId })
        // Remove undefined values
        .filter((item) => (item))
      return { ...state, feedbackUpvotes, feedbackDownvotes};
    case PULL_SOLUTION_VOTES_SUCCESS:
      const solutionUpvotes = action.payload.map((item) => { if (item.upvote) return item.solutionId })
        // Remove undefined values
        .filter((item) => (item))
      const solutionDownvotes = action.payload.map((item) => { if (item.downvote) return item.solutionId })
        // Remove undefined values
        .filter((item) => (item))
      return { ...state, solutionUpvotes, solutionDownvotes};
    case ADD_FEEDBACK_UPVOTE:
      return { ...state, feedbackUpvotes: [...state.feedbackUpvotes, action.payload.id], refreshed: false };
    case ADD_FEEDBACK_DOWNVOTE:
      return { ...state, feedbackDownvotes: [...state.feedbackDownvotes, action.payload.id], refreshed: false };
    case REMOVE_FEEDBACK_UPVOTE:
      return { ...state, feedbackUpvotes: removeItem(state.feedbackUpvotes, action.payload.id), refreshed: false };
    case REMOVE_FEEDBACK_DOWNVOTE:
      return { ...state, feedbackDownvotes: removeItem(state.feedbackDownvotes, action.payload.id), refreshed: false };
    case ADD_SOLUTION_UPVOTE:
      return { ...state, solutionUpvotes: [...state.feedbackUpvotes, action.payload.id], refreshed: false };
    case ADD_SOLUTION_DOWNVOTE:
      return { ...state, solutionDownvotes: [...state.feedbackDownvotes, action.payload.id], refreshed: false };
    case REMOVE_SOLUTION_UPVOTE:
      return { ...state, solutionUpvotes: removeItem(state.feedbackUpvotes, action.payload.id), refreshed: false };
    case REMOVE_SOLUTION_DOWNVOTE:
      return { ...state, solutionDownvotes: removeItem(state.feedbackDownvotes, action.payload.id), refreshed: false };
    default:
      return state;
  }
}
