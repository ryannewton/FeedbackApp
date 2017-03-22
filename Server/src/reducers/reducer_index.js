// Import Libraries
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import main from './reducer_main';
import feedback from './reducer_feedback';
import projects from './reducer_projects';
import upVotes from './reducer_upvotes';
import projectAdditions from './reducer_project_additions';
import discussionPosts from './reducer_discussion_posts';
import auth from './auth_reducer';

export default combineReducers({
  main,
  feedback,
  projects,
  upVotes,
  projectAdditions,
  discussionPosts,
  auth,
  routing: routerReducer,
});
