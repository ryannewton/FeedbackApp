// Import action types
import {
  REQUESTED_FEEDBACK,
  RECEIVED_FEEDBACK,
  SUBMITTING_FEEDBACK,
  SUBMIT_FEEDBACK_SUCCESS,
  SUBMIT_FEEDBACK_FAIL,
  SUBMITTING_IMAGE,
  SUBMIT_IMAGE_SUCCESS,
  SUBMIT_IMAGE_FAIL,
  ADD_FEEDBACK_UPVOTE,
  ADD_FEEDBACK_DOWNVOTE,
  REMOVE_FEEDBACK_UPVOTE,
  REMOVE_FEEDBACK_DOWNVOTE,
  SAVE_FEEDBACK_CHANGES,
  ADD_FEEDBACK_TO_STATE,
  LOG_OUT_USER,
} from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  loadingImage: false,
  imageURL: '',
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
    case REQUESTED_FEEDBACK:
      return state;

    case RECEIVED_FEEDBACK: {
      const list = filterAndOrder(action.payload.list);
      return { list, lastPulled: action.payload.lastPulled };
    }

    case SUBMITTING_FEEDBACK:
      return { ...state, loading: true };

    case SUBMIT_FEEDBACK_SUCCESS:
      return { ...state, loading: false, feedback: '', imageURL: '' };

    case SUBMIT_FEEDBACK_FAIL:
      return { ...state, loading: false };

    case SUBMITTING_IMAGE:
      return { ...state, loadingImage: true };

    case SUBMIT_IMAGE_SUCCESS: {
      return { ...state, loadingImage: false, imageURL: action.payload };
    }

    case SUBMIT_IMAGE_FAIL:
      return { ...state, loadingImage: false };

    case ADD_FEEDBACK_UPVOTE: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newState = state.list.slice(0);
      newState[index].upvotes += 1;
      return { ...state, list: newState };
    }

    case ADD_FEEDBACK_DOWNVOTE: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newState = state.list.slice(0);
      newState[index].downvotes += 1;
      return { ...state, list: newState };
    }

    case REMOVE_FEEDBACK_UPVOTE: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newList = state.list.slice(0);
      newList[index].upvotes -= 1;
      return { ...state, list: newList };
    }

    case REMOVE_FEEDBACK_DOWNVOTE: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newState = state.list.slice(0);
      newState[index].downvotes -= 1;
      return { ...state, list: newState };
    }

    case SAVE_FEEDBACK_CHANGES: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newList = state.list.slice(0);
      newList.splice(index, 1, action.payload);
      return { ...state, list: newList };
    }

    case ADD_FEEDBACK_TO_STATE: {
      return { ...state, list: [...state.list, action.payload] };
    }

    case LOG_OUT_USER:
      return INITIAL_STATE;

    default:
      return state;
  }
};
