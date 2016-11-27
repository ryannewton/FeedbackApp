//Import Libraries
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

function main(state = {}, action) {
  console.log(state, action);

  switch (action.type) {
    case 'PULL_DATA_FROM_SERVER':
      return Object.assign({}, state, {feedback: action.feedback});
      break;
    case 'UPDATE_START_DATE':
      return  Object.assign({}, state, {start_date: action.date});
      break;
    case 'UPDATE_END_DATE':
      return Object.assign({}, state, {end_date: action.date});
      break;
    default:
      return state;
  }
}

export default combineReducers({main, routing: routerReducer });
