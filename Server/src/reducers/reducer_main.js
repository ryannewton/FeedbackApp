// Import action types
import {
  REQUESTED_FEEDBACK,
} from '../actions/types';

export default function main(state = {}, action) {
  console.log(state, action);

  switch (action.type) {
    case REQUESTED_FEEDBACK:
      return { ...state, startDate: action.startDate, endDate: action.endDate };
    default:
      return state;
  }
}

