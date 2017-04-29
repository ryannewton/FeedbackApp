// Import action types
import {
  PULL_FEATURES,
} from '../actions/types';

const INITIAL_STATE = {
  moderatorApproval: true,
  showStatus: true,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PULL_FEATURES:
      return {
        ...state,
        moderatorApproval: Boolean(action.payload.moderatorApproval),
        showStatus: Boolean(action.payload.showStatus) };
    default:
      return state;
  }
};

