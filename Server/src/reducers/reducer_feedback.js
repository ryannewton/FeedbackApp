// Import action types
import {
  RECEIVED_FEEDBACK,
} from '../actions/types';

export default function feedback(state = [], action) {
  switch (action.type) {
    case RECEIVED_FEEDBACK:
      return action.feedback;
    default:
      return state;
  }
}
