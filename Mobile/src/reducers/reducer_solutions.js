// Import action types
import {
  RECEIVED_SOLUTION_LIST,
  SUBMIT_SOLUTION,
  SUBMIT_SOLUTION_SUCCESS,
  SUBMIT_SOLUTION_FAIL,
  SAVE_SOLUTION_CHANGES,
  ADD_SOLUTION_UPVOTE,
  REMOVE_SOLUTION_UPVOTE,
  ADD_SOLUTION_DOWNVOTE,
  REMOVE_SOLUTION_DOWNVOTE,
  ADD_SOLUTION_TO_STATE,
  LOG_OUT_USER,
  SOLUTION_CHANGED,
} from '../actions/types';

const INITIAL_STATE = {
  list: [],
  message: '',
  loading: false,
  solution: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RECEIVED_SOLUTION_LIST:
      return { ...state, list: action.payload.filter(s => s.approved === 1) };
    case SUBMIT_SOLUTION:
      return { ...state, loading: true, message: '' };
    case SUBMIT_SOLUTION_SUCCESS:
      return { ...state, loading: false, solution: null, message: 'Solution successfully submitted' };
    case SUBMIT_SOLUTION_FAIL:
      return { ...state, loading: false, message: action.payload || 'Error. Please try again later' };
    case SAVE_SOLUTION_CHANGES: {
      const index = state.list.findIndex(solution => solution.id === action.payload.id);
      const newList = state.list.slice(0);
      newList.splice(index, 1, action.payload);
      return { ...state, list: newList };
    }
    case ADD_SOLUTION_UPVOTE: {
      const index = state.list.findIndex(solution => solution.id === action.payload.id);
      const newList = state.list.slice(0);
      newList[index].votes += 1;
      return { ...state, list: newList };
    }
    case ADD_SOLUTION_DOWNVOTE: {
      const index = state.list.findIndex(solution => solution.id === action.payload.id);
      const newList = state.list.slice(0);
      newList[index].votes -= 1;
      return { ...state, list: newList };
    }
    case REMOVE_SOLUTION_UPVOTE: {
      const index = state.list.findIndex(solution => solution.id === action.payload.id);
      const newList = state.list.slice(0);
      newList[index].votes -= 1;
      return { ...state, list: newList };
    }
    case REMOVE_SOLUTION_DOWNVOTE: {
      const index = state.list.findIndex(solution => solution.id === action.payload.id);
      const newList = state.list.slice(0);
      newList[index].votes += 1;
      return { ...state, list: newList };
    }
    case ADD_SOLUTION_TO_STATE: {
      const solution = { type: 'solution', votes: 0, downvotes: 0, title: action.title, description: '', project_id: action.projectId, id: action.solutionId };
      return { ...state, list: [...state.list, solution] };
    }
    case SOLUTION_CHANGED:
      return { ...state, solution: action.payload };
    case LOG_OUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};
