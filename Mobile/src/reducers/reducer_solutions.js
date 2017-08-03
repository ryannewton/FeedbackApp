// Import action types
import {
  RECEIVED_SOLUTION_LIST,
  SUBMITTING_SOLUTION,
  SUBMIT_SOLUTION_SUCCESS,
  SUBMIT_SOLUTION_FAIL,
  ADD_SOLUTION_UPVOTE,
  ADD_SOLUTION_DOWNVOTE,
  REMOVE_SOLUTION_UPVOTE,
  REMOVE_SOLUTION_DOWNVOTE,
  ADD_SOLUTION_TO_STATE,
  SOLUTION_CHANGED,
  LOG_OUT_USER,  
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
    case SUBMITTING_SOLUTION:
      return { ...state, loading: true, message: '' };
    case SUBMIT_SOLUTION_SUCCESS:
      return { ...state, loading: false, solution: null, message: 'Solution successfully submitted' };
    case SUBMIT_SOLUTION_FAIL:
      return { ...state, loading: false, message: action.payload || 'Error. Please try again later' };
    case ADD_SOLUTION_UPVOTE: {
      if (action.payload.approved) {
        const index = state.list.findIndex(solution => solution.id === action.payload.id);
        const newList = state.list.slice(0);
        newList[index].upvotes += 1;
        return { ...state, list: newList };
      }
      return state;
    }
    case ADD_SOLUTION_DOWNVOTE: {
      const index = state.list.findIndex(solution => solution.id === action.payload.id);
      const newList = state.list.slice(0);
      newList[index].downvotes += 1;
      return { ...state, list: newList };
    }
    case REMOVE_SOLUTION_UPVOTE: {
      const index = state.list.findIndex(solution => solution.id === action.payload.id);
      const newList = state.list.slice(0);
      newList[index].upvotes -= 1;
      return { ...state, list: newList };
    }
    case REMOVE_SOLUTION_DOWNVOTE: {
      const index = state.list.findIndex(solution => solution.id === action.payload.id);
      const newList = state.list.slice(0);
      newList[index].downvotes -= 1;
      return { ...state, list: newList };
    }
    case ADD_SOLUTION_TO_STATE: {
      return { ...state, list: [...state.list, action.payload] };
    }
    case SOLUTION_CHANGED:
      return { ...state, solution: action.payload };
    case LOG_OUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};
