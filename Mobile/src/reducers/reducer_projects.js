// Import action types
import {
  REQUESTED_PROJECTS,
  RECEIVED_PROJECTS,
  SAVE_PROJECT_CHANGES,
  ADD_PROJECT_UPVOTE,
  REMOVE_PROJECT_UPVOTE,
  ADD_PROJECT_DOWNVOTE,
  REMOVE_PROJECT_DOWNVOTE,
  ADD_PROJECT,
  LOG_OUT_USER,
} from '../actions/types';

const INITIAL_STATE = {
  list: [],
  lastPulled: new Date(0),
};

function filterAndOrder(list) {
  const result = list
    .filter(item => item.stage !== 'tabled')
    .sort((a, b) => b.id - a.id)
    .sort((a, b) => b.votes - a.votes);
  return result;
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUESTED_PROJECTS:
      // No state change before server responds; may add loading flag
      return state;

    case RECEIVED_PROJECTS: {
      const list = filterAndOrder(action.payload.list);
      return { list, lastPulled: action.payload.lastPulled };
    }

    case SAVE_PROJECT_CHANGES: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newList = state.list.slice(0);
      newList.splice(index, 1, action.payload);
      return { ...state, list: newList };
    }

    case ADD_PROJECT: {
      const newList = [...state.list, { id: action.payload.id, title: action.payload.title, description: 'Blank Description', votes: 0, downvotes: 0, stage: 'new', type: action.payload.type }];
      return { ...state, list: newList };
    }

    case ADD_PROJECT_UPVOTE: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newState = state.list.slice(0);
      newState[index].votes += 1;
      return { ...state, list: newState };
    }

    case REMOVE_PROJECT_UPVOTE: {
      const index = state.list.findIndex(feedback => feedback.id === action.payload.id);
      const newList = state.list.slice(0);
      newList[index].votes -= 1;
      return { ...state, list: newList };
    }

    case ADD_PROJECT_DOWNVOTE: {
      const index = state.list.findIndex(project => project.id === action.payload.id);
      const newState = state.list.slice(0);
      newState[index].downvotes += 1;
      return { ...state, list: newState };
    }
    case REMOVE_PROJECT_DOWNVOTE: {
      const index = state.list.findIndex(project => project.id === action.payload.id);
      const newState = state.list.slice(0);
      newState[index].downvotes -= 1;
      return { ...state, list: newState };
    }

    case LOG_OUT_USER:
      return INITIAL_STATE;

    default:
      return state;
  }
};
