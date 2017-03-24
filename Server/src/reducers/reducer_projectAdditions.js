// Import action types
import {
  REQUESTED_PROJECT_ADDITIONS,
  RECEIVED_PROJECT_ADDITIONS,
  SAVE_PROJECT_ADDITION_CHANGES,
  ADD_SOLUTION,
  DELETE_PROJECT_ADDITION,
} from '../actions/types';

export default function projectAdditions(state = [], action) {
  switch (action.type) {
    case REQUESTED_PROJECT_ADDITIONS:
      return state;
    case RECEIVED_PROJECT_ADDITIONS:
      return action.projectAdditions;
    case SAVE_PROJECT_ADDITION_CHANGES:
      const index = state.findIndex(projectAddition => projectAddition.id === action.projectAddition.id);
      const newState = state.slice(0);
      newState.splice(index, 1, action.projectAddition);
      return newState;
    case ADD_SOLUTION:
      return [...state, {
        id: action.projectAddition_id,
        type: 'solution',
        votes: 0,
        title: 'Title Here',
        description: 'Description Here',
        project_id: action.project_id,
      }];
    case DELETE_PROJECT_ADDITION:
      return state.filter(projectAddition => projectAddition.id !== action.payload);
    default:
      return state;
  }
}
