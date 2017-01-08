export default function main(state = {}, action) {
	console.log(action);

  switch (action.type) {
    case 'REQUESTED_FEEDBACK':
      return Object.assign({}, state, {start_date: action.start_date, end_date: action.end_date});
      break;
    default:
      return state;
  }
}

