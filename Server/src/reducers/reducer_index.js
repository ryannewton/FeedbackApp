// Import Libraries
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// Import reducers
import main from './reducer_main';
import projects from './reducer_projects';
import auth from './auth_reducer';
import user from './reducer_user';
import feedback from './reducer_feedback';
import upVotes from './reducer_upvotes';
import projectAdditions from './reducer_project_additions';
import discussionPosts from './reducer_discussion_posts';

export default combineReducers({
  main,
  projects,
  auth,
  user,
  feedback,
  upVotes,
  projectAdditions,
  discussionPosts,
  routing: routerReducer,
});
