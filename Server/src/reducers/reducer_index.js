//Import Libraries
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import main from './reducer_main.js';
import feedback from './reducer_feedback.js';
import projects from './reducer_projects.js';
import up_votes from './reducer_upvotes.js';
import project_additions from './reducer_project_additions.js';
import discussion_posts from './reducer_discussion_posts.js';
import auth from './auth_reducer.js';

export default combineReducers({main, feedback, projects, up_votes, project_additions, discussion_posts, auth, routing: routerReducer });
