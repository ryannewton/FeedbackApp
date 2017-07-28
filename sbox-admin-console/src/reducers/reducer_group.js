// Import action types
import {
  GROUP_TREE_INFO,
  PULL_GROUP_INFO,
  SIGNOUT_USER,
} from '../actions/types';

const INITIAL_STATE = {
  groupTree: [],
  includePositiveFeedbackBox: null,
  categories: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GROUP_TREE_INFO:
      return { ...state, groupTree: action.payload };
    case PULL_GROUP_INFO:
      return { ...state,
        includePositiveFeedbackBox: Boolean(action.payload.groupInfo.includePositiveFeedbackBox),
        categories: action.payload.categories,
      };
    case SIGNOUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};
