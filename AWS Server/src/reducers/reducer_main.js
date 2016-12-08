//Import Libraries
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

/*
function pullDateFromServer(start_date, end_date) {
  let feedback = [];
  let props = this.props;

  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/pullFeedback", true);
  xhttp.setRequestHeader('Content-Type', 'application/json');   
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      feedback = JSON.parse(xhttp.responseText);
      console.log(feedback);
      props.pullDataFromServer(feedback);   
    }
  };

  let params = {
    start_date: this.props.main.start_date,
    end_date: this.props.main.end_date
  }
  xhttp.send(JSON.stringify(params));
}
*/

function main(state = {}, action) {
  console.log(state, action);

  switch (action.type) {
    case 'REQUESTED_FEEDBACK':
      return Object.assign({}, state, {start_date: action.start_date, end_date: action.end_date});
      break;
    case 'RECEIVED_FEEDBACK':
      return  Object.assign({}, state, {feedback: action.feedback});
      break;
    default:
      return state;
  }
}

export default combineReducers({main, routing: routerReducer });
