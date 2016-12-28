//Import Libraries
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import main from './reducer_main.js';
import feedback from './reducer_feedback.js';
import projects from './reducer_projects.js';
import up_votes from './reducer_upvotes.js';

export default combineReducers({main, feedback, projects, up_votes, routing: routerReducer });
