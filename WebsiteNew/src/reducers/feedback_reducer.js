// Import action types
import {
  REQUEST_FEEDBACK,
  REQUEST_FEEDBACK_SUCCESS,
  SIGNOUT_USER,
} from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  list: [],
  lastPulled: new Date(0),
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
      return { ...state, list, lastPulled: action.payload.lastPulled, loading: false };
    }

    case SIGNOUT_USER:
      return INITIAL_STATE;

    default:
      return state;
  }
};
