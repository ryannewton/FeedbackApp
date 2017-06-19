// Import Libraries
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

// Import actions, reducers, and constants
import CombinedReducer from './index.js';

const store = createStore(
  CombinedReducer,
  applyMiddleware(thunkMiddleware),
);

export default store;
