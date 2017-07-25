// Import Libraries
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

// Import actions
import { pullFeedback, pullSolutions, pullGroupInfo, pullGroupTreeInfo, authorizeUserFail } from '../actions';

// Import Reducers
import CombinedReducer from '../reducers';

const store = createStore(
  CombinedReducer,
  applyMiddleware(thunkMiddleware),
);

const token = localStorage.getItem('token');
if (token) {
  store.dispatch(pullFeedback(token));
  store.dispatch(pullSolutions(token));
  //store.dispatch(pullGroupTreeInfo(token));
  store.dispatch(pullGroupInfo(token));
}
else store.dispatch(authorizeUserFail(''));

export default store;
