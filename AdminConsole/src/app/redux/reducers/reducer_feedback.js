// Import action types
import {
  REQUEST_FEEDBACK,
  REQUEST_FEEDBACK_SUCCESS,
  REQUEST_FEEDBACK_FAIL,
  SUBMIT_OFFICIAL_REPLY,
  SUBMIT_OFFICIAL_REPLY_SUCCESS,
  SIGNOUT_USER,
  UPDATE_FEEDBACK
} from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  list: [],
  lastPulled: new Date(0),
  error: false,
};

function filterAndOrder(list) {
  const result = list
    .filter(item => item.stage !== 'tabled')
    .sort((a, b) => b.id - a.id)
    .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
  return result;
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUEST_FEEDBACK:
      return { ...state, loading: true };

    case REQUEST_FEEDBACK_SUCCESS: {
      const list = filterAndOrder(action.payload.list);
      return { ...state, list, lastPulled: action.payload.lastPulled, loading: false, error: false };
    }

    case UPDATE_FEEDBACK: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newList = state.list.slice(0);
      newList[index] = action.payload;
      return { ...state, list: newList, loading: false };

    }

    case REQUEST_FEEDBACK_FAIL:
      return { ...state, loading: false, error: true }

    case SUBMIT_OFFICIAL_REPLY:
      return { ...state, loading: true };

    case SUBMIT_OFFICIAL_REPLY_SUCCESS:
      const index = state.list.findIndex(feedback => feedback.id === action.payload.feedback.id);
      const newList = state.list.slice(0);
      newList[index].officialReply = action.payload.officialReply;
      return { ...state, list: newList, loading: false };

    case SIGNOUT_USER:
      return INITIAL_STATE;

    default:
      return state;
  }
};
