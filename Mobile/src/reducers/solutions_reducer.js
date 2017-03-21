// Import action types
import {
  RECEIVED_SOLUTION_LIST,
  SUBMIT_SOLUTION,
  SUBMIT_SOLUTION_SUCCESS,
  SUBMIT_SOLUTION_FAIL,
  SAVE_SOLUTION_CHANGES,
  ADD_SOLUTION_UPVOTE,
  REMOVE_SOLUTION_UPVOTE,
} from '../actions/types';

const INITIAL_STATE = {
  list: [],
  message: '',
  loading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RECEIVED_SOLUTION_LIST:
      return { ...state, list: action.payload };
    case SUBMIT_SOLUTION:
      return { ...state, loading: true, message: '' };
    case SUBMIT_SOLUTION_SUCCESS:
      return { ...state, loading: false, message: 'Solution successfully submitted' };
    case SUBMIT_SOLUTION_FAIL:
      return { ...state, loading: false, message: 'Error. Please try again later' };
    case SAVE_SOLUTION_CHANGES: {
      const index = state.list.findIndex(solution => solution.id === action.payload.id);
      const newList = state.list.slice(0);
      newList.splice(index, 1, action.payload);
      return { ...state, list: newList };
    }
    case ADD_SOLUTION_UPVOTE: {
      const index = state.list.findIndex(solution => solution.id === action.payload.id);
      const newList = state.list.slice(0);
      console.log("index", index);
      console.log('newList', newList);
      newList[index].votes += 1;
      return { ...state, list: newList };
    }
    case REMOVE_SOLUTION_UPVOTE: {
      const index = state.list.findIndex(solution => solution.id === action.payload.id);
      const newList = state.list.slice(0);
      newList[index].votes -= 1;
      return { ...state, list: newList };
    }
    default:
      return state;
  }
};
