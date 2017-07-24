// Import action types
import {
  GROUP_TREE_INFO,
  PULL_GROUP_INFO,
  SAVE_GROUP_CODE
} from '../actions/types';

const INITIAL_STATE = {
  groupTree: [],
  feedbackRequiresApproval: false,
  groupCode: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GROUP_TREE_INFO:
      return { ...state, groupTree: action.payload}
    case PULL_GROUP_INFO:
      return { ...state, feedbackRequiresApproval: Boolean(action.payload.feedbackRequiresApproval)}
    case SAVE_GROUP_CODE:
      return { ...state, groupCode: action.payload};
    default:
      return state;
  }
};
