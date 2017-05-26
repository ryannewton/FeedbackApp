// Import action types
import {
  FEEDBACK_CHANGED,
  SUBMIT_FEEDBACK,
  SUBMIT_FEEDBACK_SUCCESS,
  SUBMIT_FEEDBACK_FAIL,
  LOG_OUT_USER,
} from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  feedback: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FEEDBACK_CHANGED:
      return { ...state, feedback: action.payload };
    case SUBMIT_FEEDBACK:
      return { ...state, loading: true };
    case SUBMIT_FEEDBACK_SUCCESS:
      return { ...state, loading: false, feedback: '' };
    case SUBMIT_FEEDBACK_FAIL:
      return { ...state, loading: false };
    case LOG_OUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};

