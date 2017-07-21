// Import action types
import {
  GROUP_TREE_INFO,
  PULL_GROUP_INFO
} from '../actions/types';

const INITIAL_STATE = {
  groupTree: [],
  feedbackRequiresApproval: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GROUP_TREE_INFO:
      return { ...state, groupTree: action.payload}
    case PULL_GROUP_INFO:
      return { ...state, feedbackRequiresApproval: Boolean(action.payload.feedbackRequiresApproval)}
    default:
      return state;
  }
};
