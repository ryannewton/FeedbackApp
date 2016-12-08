import Moment from 'moment';
import fetch from 'isomorphic-fetch'

let actions = {
	
	requestedFeedback(start_date, end_date) {
		return {
			type: 'REQUESTED_FEEDBACK',
			start_date,
			end_date,			
		}
	},

	receivedFeedback(feedback) {
		console.log(feedback);
		return {
			type: 'RECEIVED_FEEDBACK',
			feedback,			
		}
	},

	updateDates(start_date, end_date, requestedFeedback, receivedFeedback) {

	  return function (dispatch) {

	    dispatch(requestedFeedback(start_date, end_date));

	    return fetch(`/pullFeedback`, {
	    	method: 'POST',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json',
	      },
	      body: JSON.stringify({
	        start_date,
	        end_date,
	      }),
    	})
      .then(response => response.json() )
      .then(feedback => dispatch(receivedFeedback(feedback)) )
      .catch(error => console.error(error) );

	  }
	}
}

export default actions