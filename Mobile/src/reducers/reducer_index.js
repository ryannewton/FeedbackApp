'use strict';

//Import Libraries
import { combineReducers } from 'redux';
import main from './reducer_main.js';
import navigation from './reducer_navigation.js';
import projects from './reducer_projects.js';
import up_votes from './reducer_up_votes.js';

export default combineReducers({ main, navigation, projects, up_votes });
