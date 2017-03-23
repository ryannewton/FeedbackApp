const INITIAL_STATE = {
	main: {
		email: null,
		startDate: null,
    	endDate: null,    
	},
};

export default function main(state = {}, action) {
	console.log(action);

  switch (action.type) {
	case 'UPDATE_EMAIL':
		localStorage.setItem('email', action.email);
		return Object.assign({}, state, {email: action.email});
	case 'REQUESTED_FEEDBACK':
	  return Object.assign({}, state, {startDate: action.startDate, endDate: action.endDate});
	  break;
	default:
	  return state;
  }
}

