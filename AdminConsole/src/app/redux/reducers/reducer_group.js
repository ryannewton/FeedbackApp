// Import action types
import {
  GROUP_TREE_INFO
} from '../actions/types';

const INITIAL_STATE = {
  groupTree: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GROUP_TREE_INFO:
      return { ...state, groupTree: action.payload}
    default:
      return state;
  }
};
