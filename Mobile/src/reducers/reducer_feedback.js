// Import action types
import {
  UPDATE_FEEDBACK_TEXT,
  UPDATE_IMAGE_URL,
  UPDATE_CATEGORY,
  UPDATE_FEEDBACK_TYPE,
  UPDATE_ERROR_MESSAGE,
  EDITING_FEEDBACK,
  CLEAR_FEEDBACK_ON_STATE,
  REQUESTED_FEEDBACK,
  RECEIVED_FEEDBACK,
  SUBMITTING_FEEDBACK,
  SUBMIT_FEEDBACK_SUCCESS,
  SUBMIT_FEEDBACK_FAIL,
  UPDATE_FEEDBACK_SUCCESS,
  UPDATE_FEEDBACK_FAIL,
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
  AUTHORIZE_USER_SUCCESS,
  DELETE_FEEDBACK,
  ROUTE,
  CHANGE_SORT_METHOD,
} from '../actions/types';

const INITIAL_STATE = {
  // List of all feedback
  list: [],
  lastPulled: new Date(0),

  // Data for feedback about to be submitted
  text: '',
  imageURL: '',
  category: '',
  type: '',
  imageWidth: null,
  imageHeight: null,

  // Rendering information
  filterMethod: 'all',
  sortMethod: 'New',
  searchQuery: 'Search',
  searchInProgress: false,
  refreshing: false,
  route: false,
  loading: false,
  loadingImage: false,
  errorMessage: '',
  editing: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_FEEDBACK_TEXT:
      return { ...state, text: action.payload };
    case UPDATE_IMAGE_URL:
      return { ...state, imageURL: action.payload };
    case UPDATE_CATEGORY:
      return { ...state, category: action.payload };
    case UPDATE_FEEDBACK_TYPE:
      return { ...state, type: action.payload };
    case REQUESTED_FEEDBACK:
      return { ...state, refreshing: true };
    case UPDATE_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload };
    case EDITING_FEEDBACK:
      return { ...state, editing: true };
    case CLEAR_FEEDBACK_ON_STATE:
      return { ...INITIAL_STATE, list: state.list, lastPulled: state.lastPulled };
    case RECEIVED_FEEDBACK:
      return { ...state, list: action.payload.list, lastPulled: action.payload.lastPulled, refreshing: false };
    case AUTHORIZE_USER_FAIL:
      return { ...state, refreshing: false };
    case AUTHORIZE_USER_SUCCESS:
      return { ...state, refreshing: false };
    case SUBMITTING_FEEDBACK:
      return { ...state, loading: true };
    case SUBMIT_FEEDBACK_SUCCESS:
      return { ...state, loading: false, text: '', category: '', imageURL: '', type: '', errorMessage: '', editing: false };
    case SUBMIT_FEEDBACK_FAIL:
      return { ...state, loading: false };
    case SUBMITTING_IMAGE:
      return { ...state, loadingImage: true };
    case SUBMIT_IMAGE_SUCCESS:
      return { ...state, loadingImage: false, imageURL: action.payload };
    case SUBMIT_IMAGE_FAIL:
      return { ...state, loadingImage: false };
    case REMOVE_IMAGE:
      return { ...state, imageURL: '' };
    case SEARCH_IN_PROGRESS:
      return { ...state, searchInProgress: action.payload };
    case CHANGE_FILTER_METHOD:
      return { ...state, filterMethod: action.payload };
    case CHANGE_SORT_METHOD:
      return { ...state, sortMethod: action.payload };
    case ADD_FEEDBACK_UPVOTE: {
      if (action.payload.approved) {
        const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
        const newState = state.list.slice(0);
        newState[index].upvotes += 1;
        return { ...state, list: newState };
      }
      return { ...state };
    }
    case REMOVE_FEEDBACK_UPVOTE: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newList = state.list.slice(0);
      newList[index].upvotes -= 1;
      return { ...state, list: newList };
    }
    case ADD_FEEDBACK_DOWNVOTE: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newState = state.list.slice(0);
      newState[index].downvotes += 1;
      return { ...state, list: newState };
    }
    case REMOVE_FEEDBACK_DOWNVOTE: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newState = state.list.slice(0);
      newState[index].downvotes -= 1;
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
    case UPDATE_FEEDBACK_SUCCESS: {
      if (action.payload.approved) {
        const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
        const newState = state.list.slice(0);
        newState[index].category = action.payload.category;
        newState[index].imageURL = action.payload.imageURL;
        newState[index].text = action.payload.text;
        return { ...state, list: newState, errorMessage: '', text: '', imageURL: '', category: '', type: '', editing: false };
      }
      return { ...state, list: state.list.filter(feedback => feedback.id !== action.payload.id), errorMessage: '', text: '', imageURL: '', category: '', type: '', editing: false };
    }
    case UPDATE_FEEDBACK_FAIL:
      return { ...state, loading: false };
    case SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case SAVE_FEEDBACK_CHANGES: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newList = state.list.slice(0);
      newList.splice(index, 1, action.payload);
      return { ...state, list: newList };
    }
    case ADD_FEEDBACK_TO_STATE: {
      return { ...state, list: [...state.list, action.payload] };
    }
    case DELETE_FEEDBACK: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newList = state.list.slice(0);
      newList[index].status = 'deleted';
      return { ...state, list: newList };
    }
    case ROUTE: {
      return { ...state, route: true };
    }
    case LOG_OUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};
