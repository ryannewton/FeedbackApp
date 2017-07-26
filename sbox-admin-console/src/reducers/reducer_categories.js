import {
  PULL_CATEGORIES_SUCCESS,
} from '../actions/types';

const INITIAL_STATE = {
  categories: ['Store Operations', 'Merchandising', 'Planning and Allocation', 'Marketing'],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PULL_CATEGORIES_SUCCESS:
      return { ...state, categories: action.payload};
    default:
      return state;
  }
};
