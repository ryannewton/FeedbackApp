// Import action types
import {
  REQUESTED_PROJECTS,
  RECEIVED_PROJECTS,
  SAVE_PROJECT_CHANGES,
  ADD_PROJECT_UPVOTE,
  REMOVE_PROJECT_UPVOTE,
  ADD_PROJECT,
  LOG_OUT_USER,
} from '../actions/types';

export default (state = null, action) => {
  switch (action.type) {
    case REQUESTED_PROJECTS:
      return state;
    case RECEIVED_PROJECTS:
      return action.payload.filter(item => item.stage !== 'tabled')
        .sort((a, b) => b.id - a.id)
        .sort((a, b) => b.votes - a.votes);
    case SAVE_PROJECT_CHANGES: {
      const index = state.findIndex(project => project.id === action.payload.id);
      const newState = state.slice(0);
      newState.splice(index, 1, action.payload);
      return newState;
    }
    case ADD_PROJECT: {
      return [...state, { id: action.payload.id, title: action.payload.title, description: 'Blank Description', votes: 0, stage: 'new' }];
    }
    case ADD_PROJECT_UPVOTE: {
      const index = state.findIndex(project => project.id === action.payload.id);
      const newState = state.slice(0);
      newState[index].votes += 1;
      return newState;
    }
    case REMOVE_PROJECT_UPVOTE: {
      const index = state.findIndex(project => project.id === action.payload.id);
      const newState = state.slice(0);
      newState[index].votes -= 1;
      return newState;
    }
    case LOG_OUT_USER:
      return null;
    default:
      return state;
  }
};
