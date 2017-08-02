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
  ADD_FEEDBACK_NO_OPINION,
  REMOVE_FEEDBACK_NO_OPINION,
  REMOVE_FEEDBACK_UPVOTE,
  REMOVE_FEEDBACK_DOWNVOTE,
  SAVE_FEEDBACK_CHANGES,
  ADD_FEEDBACK_TO_STATE,
  LOG_OUT_USER,
  CHANGE_FILTER_METHOD,
  SET_SEARCH_QUERY,
  SEARCH_IN_PROGRESS,
  REMOVE_IMAGE,
  AUTHORIZE_USER_FAIL,
  AUTHORIZE_USER_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  loadingImage: false,
  imageURL: '',
  positiveImageURL: '',
  negativeImageURL: '',
  list: [],
  lastPulled: new Date(0),
  filterMethod: 'all',
  searchQuery: 'Search',
  searchInProgress: false,
  refreshing: false
};

function filterAndOrder(list) {
  const result = list
    .sort((a, b) => b.id - a.id)
    .sort((a, b) => (b.trendingScore) - (a.trendingScore));
  return result;
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUESTED_FEEDBACK:
      return { ...state, refreshing: true};

    case RECEIVED_FEEDBACK: {
      const list = filterAndOrder(action.payload.list);
      return { list, lastPulled: action.payload.lastPulled, refreshing: false };
    }

    case AUTHORIZE_USER_FAIL: {
      return { ...state, refreshing: false};
    }

    case AUTHORIZE_USER_SUCCESS: {
      return { ...state, refreshing: false};
    }

    case SUBMITTING_FEEDBACK:
      return { ...state, loading: true };

    case SUBMIT_FEEDBACK_SUCCESS:
      return { ...state, loading: false, feedback: '', imageURL: '', positiveImageURL: '', negativeImageURL: '' };

    case SUBMIT_FEEDBACK_FAIL:
      return { ...state, loading: false };

    case SUBMITTING_IMAGE:
      return { ...state, loadingImage: true };

    case REMOVE_IMAGE:
      return { ...state, imageURL: ''};

    case SUBMIT_IMAGE_SUCCESS: {
      if (!action.payload.type)
        return { ...state, loadingImage: false, imageURL: action.payload.location };
      else if (action.payload.type === 'positive')
        return { ...state, loadingImage: false, positiveImageURL: action.payload.location };
      else if (action.payload.type === 'negative')
        return { ...state, loadingImage: false, negativeImageURL: action.payload.location };
    }

    case SEARCH_IN_PROGRESS: {
      return { ...state, searchInProgress: action.payload };
    }

    case CHANGE_FILTER_METHOD:
      return { ...state, filterMethod: action.payload };

    case SUBMIT_IMAGE_FAIL:
      return { ...state, loadingImage: false };

    case ADD_FEEDBACK_UPVOTE: {
      if (action.payload.approved) {
        const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
        const newState = state.list.slice(0);
        newState[index].upvotes += 1;
        return { ...state, list: newState };
      }
      return { ...state };
    }

    case ADD_FEEDBACK_DOWNVOTE: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newState = state.list.slice(0);
      newState[index].downvotes += 1;
      return { ...state, list: newState };
    }

    case ADD_FEEDBACK_NO_OPINION: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newState = state.list.slice(0);
      newState[index].noOpinions += 1;
      return { ...state, list: newState };
    }

    case REMOVE_FEEDBACK_NO_OPINION: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newList = state.list.slice(0);
      newList[index].noOpinions -= 1;
      return { ...state, list: newList };
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

    case SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };

    case SAVE_FEEDBACK_CHANGES: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newList = state.list.slice(0);
      newList.splice(index, 1, action.payload);
      return { ...state, list: newList };
    }

    case ADD_FEEDBACK_TO_STATE: {
      return { ...state, list: filterAndOrder([...state.list, action.payload]) };
    }

    case LOG_OUT_USER:
      return INITIAL_STATE;

    default:
      return state;
  }
};
