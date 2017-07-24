// Import actions, reducers, and constants
import store from '../store';
import * as actions from '../actions';

const loadOnLaunch = (token) => {
  console.log('launch: ', token);
  store.dispatch(actions.pullFeedback(token));
  store.dispatch(actions.pullSolutions(token));
  store.dispatch(actions.pullGroupTreeInfo(token));
  store.dispatch(actions.pullFeedbackVotes(token))
  store.dispatch(actions.pullSolutionVotes());

};

export default loadOnLaunch;
