// Import action types
import {
  PULL_FEATURES,
  LOG_OUT_USER,
} from '../actions/types';

const INITIAL_STATE = {
  moderatorApproval: true,
  moderatorApprovalSolutions: true,
  showStatus: true,
  enableNewFeedback: null,
  domain: null,
  email: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PULL_FEATURES:
      return {
        ...state,
        moderatorApproval: Boolean(action.payload.moderatorApproval),
        moderatorApprovalSolutions: Boolean(action.payload.moderatorApprovalSolutions),
        showStatus: Boolean(action.payload.showStatus),
        enableNewFeedback: Boolean(action.payload.enableNewFeedback),
        domain: action.payload.domain,
        email: action.payload.email,
      };
    case LOG_OUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};

