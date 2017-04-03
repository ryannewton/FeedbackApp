// Import types & other action creators
import {
  ADD_PROJECT_UPVOTE,
  REMOVE_PROJECT_UPVOTE,
  LOAD_PROJECT_UPVOTES,
} from './types';

export const addProjectUpvote = project => (
  { 
    type: ADD_PROJECT_UPVOTE,
    payload: project,
  }  
);

export const removeProjectUpvote = project => (
  { 
    type: REMOVE_PROJECT_UPVOTE,
    payload: project,
  } 
);

export const loadProjectUpvotes = projectUpvotes => (
  {
    type: LOAD_PROJECT_UPVOTES,
    payload: projectUpvotes,
  }
);
