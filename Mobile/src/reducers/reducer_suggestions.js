// Import action types
import {
  REQUESTED_SUGGESTIONS,
  RECEIVED_SUGGESTIONS,
  SUBMITTING_SUGGESTION,
  SUBMIT_SUGGESTION_SUCCESS,
  SUBMIT_SUGGESTION_FAIL,
  SUBMITTING_IMAGE,
  SUBMIT_IMAGE_SUCCESS,
  SUBMIT_IMAGE_FAIL,
  ADD_SUGGESTION_UPVOTE,
  ADD_SUGGESTION_DOWNVOTE,
  REMOVE_SUGGESTION_UPVOTE,
  REMOVE_SUGGESTION_DOWNVOTE,
  SAVE_SUGGESTION_CHANGES,
  ADD_SUGGESTION_TO_STATE,
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
    case REQUESTED_SUGGESTIONS:
      return state;

    case RECEIVED_SUGGESTIONS: {
      const list = filterAndOrder(action.payload.list);
      return { list, lastPulled: action.payload.lastPulled };
    }

    case SUBMITTING_SUGGESTION:
      return { ...state, loading: true };

    case SUBMIT_SUGGESTION_SUCCESS:
      return { ...state, loading: false, feedback: '' };

    case SUBMIT_SUGGESTION_FAIL:
      return { ...state, loading: false };

    case SUBMITTING_IMAGE:
      return { ...state, loadingImage: true };

    case SUBMIT_IMAGE_SUCCESS: {
      return { ...state, loadingImage: false, imageURL: action.payload };
    }

    case SUBMIT_IMAGE_FAIL:
      return { ...state, loadingImage: false };

    case ADD_SUGGESTION_UPVOTE: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newState = state.list.slice(0);
      newState[index].upvotes += 1;
      return { ...state, list: newState };
    }

    case ADD_SUGGESTION_DOWNVOTE: {
      const index = state.list.findIndex(project => project.id === action.payload.id);
      const newState = state.list.slice(0);
      newState[index].downvotes += 1;
      return { ...state, list: newState };
    }

    case REMOVE_SUGGESTION_UPVOTE: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newList = state.list.slice(0);
      newList[index].upvotes -= 1;
      return { ...state, list: newList };
    }
    
    case REMOVE_SUGGESTION_DOWNVOTE: {
      const index = state.list.findIndex(project => project.id === action.payload.id);
      const newState = state.list.slice(0);
      newState[index].downvotes -= 1;
      return { ...state, list: newState };
    }

    case SAVE_SUGGESTION_CHANGES: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newList = state.list.slice(0);
      newList.splice(index, 1, action.payload);
      return { ...state, list: newList };
    }

    case ADD_SUGGESTION_TO_STATE: {
      return { ...state, list: [...state.list, action.payload.suggestion] };
    }

    case LOG_OUT_USER:
      return INITIAL_STATE;

    default:
      return state;
  }
};