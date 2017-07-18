// Import action types
import {
  REQUEST_SOLUTIONS,
  REQUEST_SOLUTIONS_SUCCESS,
  APPROVE_SOLUTION,
  APPROVE_SOLUTION_SUCCESS,
  APPROVE_SOLUTION_FAIL,
  CLARIFY_SOLUTION,
  CLARIFY_SOLUTION_SUCCESS,
  CLARIFY_SOLUTION_FAIL,
  REJECT_SOLUTION,
  REJECT_SOLUTION_SUCCESS,
  REJECT_SOLUTION_FAIL,
} from './types';

// Import constants
import http from '../../constants';

export const pullSolutions = (token) => (
  (dispatch) => {
    dispatch({ type: REQUEST_SOLUTIONS });

    http.post('/pullSolutions', { authorization: token })
    .then((response) => {
      const lastPulled = new Date();
      dispatch({ type: REQUEST_SOLUTIONS_SUCCESS, payload: { list: response.data, lastPulled } });
    })
    .catch((error) => {
      console.log('Error running pullSolutions()');
      console.log('Error: ', error);
    });
  }
);

export const approveSolution = (solution) => (
  (dispatch) => {
    dispatch({ type: APPROVE_SOLUTION, payload: solution });

    const token = localStorage.getItem('token');
    http.post('/approveSolution', { authorization: token, solution })
    .then((response) => {
      dispatch({ type: APPROVE_SOLUTION_SUCCESS, payload: solution });
    })
    .catch((error) => {
      console.log('approveSolution() Fail');
      console.log('Error: ', error);
      dispatch({ type: APPROVE_SOLUTION_FAIL, payload: solution });
    })
  }
);

export const clarifySolution = (solution) => (
  (dispatch) => {
    console.log('clarifySolution() not functional');
    dispatch({ type: CLARIFY_SOLUTION, payload: solution });

    // const token = localStorage.getItem('token');
    // http.post('', { authorization: token, solution })
    // .then((response) => {
    //   console.log('clarifySolution() success');
    //   dispatch({ type: CLARIFY_SOLUTION_SUCCESS, payload: solution });
    // })
    // .catch((error) => {
    //   console.log('clarifySolution() Fail');
    //   console.log('Error: ', error);
    //   dispatch({ type: CLARIFY_SOLUTION_FAIL, payload: solution });
    // })
  }
);

export const rejectSolution = (solution) => (
  (dispatch) => {
    console.log('rejectSolution() not functional');
    dispatch({ type: REJECT_SOLUTION, payload: solution });

    // const token = localStorage.getItem('token');
    // http.post('/deleteSolution', { authorization: token, solution })
    // .then((response) => {
    //   console.log('rejectSolution() success');
    //   dispatch({ type: REJECT_SOLUTION_SUCCESS, payload: solution });
    // })
    // .catch((error) => {
    //   console.log('rejectSolution() Fail');
    //   console.log('Error: ', error);
    //   dispatch({ type: REJECT_SOLUTION_FAIL, payload: solution });
    // })
  }
);

