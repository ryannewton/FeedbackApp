// Import action types
import {
  REQUEST_FEEDBACK,
  REQUEST_FEEDBACK_SUCCESS,
  REQUEST_FEEDBACK_FAIL,
  SUBMIT_OFFICIAL_REPLY,
  SUBMIT_OFFICIAL_REPLY_SUCCESS,
  SIGNOUT_USER,
  UPDATE_FEEDBACK_STATUS,
  UPDATE_FEEDBACK,
  APPROVE_FEEDBACK_SUCCESS,
  CLARIFY_FEEDBACK_SUCCESS,
  REJECT_FEEDBACK_SUCCESS,
  CLARIFY_FEEDBACK_FAIL,
} from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  list: [],
  lastPulled: new Date(0),
  error: false,
  clarifyError: false,
};

function filterAndOrder(list) {
  const result = list
    .filter(item => item.stage !== 'tabled')
    .sort((a, b) => b.id - a.id)
    .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
  return result;
}

export default (state = INITIAL_STATE, action) => {
  let index;
  let newList;
  switch (action.type) {
    case REQUEST_FEEDBACK:
      return { ...state, loading: true };
    case REQUEST_FEEDBACK_SUCCESS:
      return { ...state, list: filterAndOrder(action.payload.list), lastPulled: action.payload.lastPulled, loading: false, error: false };
    case CLARIFY_FEEDBACK_FAIL:
      return { ...state, clarifyError: true };
    case UPDATE_FEEDBACK: {
      index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      newList = state.list.slice(0);
      newList[index] = action.payload;
      return { ...state, list: newList, loading: false };
    }
    case REQUEST_FEEDBACK_FAIL:
      return { ...state, loading: false, error: true };
    case SUBMIT_OFFICIAL_REPLY:
      return { ...state, loading: true };
    case SUBMIT_OFFICIAL_REPLY_SUCCESS:
      index = state.list.findIndex(feedback => feedback.id === action.payload.feedback.id);
      newList = state.list.slice(0);
      newList[index].officialReply = action.payload.officialReply;
      return { ...state, list: newList, loading: false };
    case APPROVE_FEEDBACK_SUCCESS:
      index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      newList = state.list.slice(0);
      newList[index].approved = 1;
      newList[index].status = 'new';
      return { ...state, list: newList };
    case REJECT_FEEDBACK_SUCCESS:
      index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      newList = state.list.slice(0);
      console.log('index: ', index, ' newList: ', newList);
      newList[index].approved = 0;
      newList[index].status = 'reject';
      console.log('index: ', index, ' newList: ', newList);
      return { ...state, list: newList };
    case CLARIFY_FEEDBACK_SUCCESS:
      index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      newList = state.list.slice(0);
      newList[index].approved = 0;
      newList[index].status = 'clarify';
      return { ...state, list: newList };
    case UPDATE_FEEDBACK_STATUS:
      index = state.list.findIndex(feedback => feedback.id === action.payload.feedback.id);
      newList = state.list.slice(0);
      newList[index].status = action.payload.status;
      return { ...state, list: newList };
    case SIGNOUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};
