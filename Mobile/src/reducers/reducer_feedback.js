// Import action types
import {
  SUBMIT_FEEDBACK,
  SUBMIT_FEEDBACK_SUCCESS,
  SUBMIT_FEEDBACK_FAIL,
  SUBMIT_IMAGE,
  SUBMIT_IMAGE_SUCCESS,
  SUBMIT_IMAGE_FAIL,
  LOG_OUT_USER,
} from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  loadingImage: false,
  imageURL: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SUBMIT_FEEDBACK:
      return { ...state, loading: true };

    case SUBMIT_FEEDBACK_SUCCESS:
      return { ...state, loading: false, feedback: '' };

    case SUBMIT_FEEDBACK_FAIL:
      return { ...state, loading: false };

    case SUBMIT_IMAGE:
      return { ...state, loadingImage: true };

    case SUBMIT_IMAGE_SUCCESS: {
      return { ...state, loadingImage: false, imageURL: action.payload };
    }

    case SUBMIT_IMAGE_FAIL:
      return { ...state, loadingImage: false };

    case LOG_OUT_USER:
      return INITIAL_STATE;

    default:
      return state;
  }
};

