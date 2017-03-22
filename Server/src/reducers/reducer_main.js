const INITIAL_STATE = {
	main: {
		email: null,
		start_date: null,
    	end_date: null,    
	},
};

export default function main(state = {}, action) {
	console.log(action);

  switch (action.type) {
	case 'UPDATE_EMAIL':
		localStorage.setItem('email', action.email);
		return Object.assign({}, state, {email: action.email});
	case 'REQUESTED_FEEDBACK':
	  return Object.assign({}, state, {start_date: action.start_date, end_date: action.end_date});
	  break;
	default:
	  return state;
  }
}

