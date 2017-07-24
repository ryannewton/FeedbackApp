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
  SUBMITTING_SOLUTION,
  SUBMIT_SOLUTION_SUCCESS,
  SUBMIT_SOLUTION_FAIL,
  ADD_SOLUTION_TO_STATE,
  ADD_SOLUTION_UPVOTE,
  ADD_SOLUTION_DOWNVOTE,
  REMOVE_SOLUTION_UPVOTE,
  REMOVE_SOLUTION_DOWNVOTE,
  SOLUTION_CHANGED,
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

export const submitSolutionToServer = (text, feedbackId, solutionsRequireApproval) => (
  (dispatch, getState) => {
    const token = getState().auth.token;
    let solution = { text, feedbackId };
    http.post('/submitSolution', { solution, authorization: token })
    .then((response) => {
      if (!solutionsRequireApproval) {
        solution = {
          id: response.data.id,
          feedbackId,
          text,
          upvotes: 0,
          downvotes: 0,
          approved: 1,
        };
        dispatch({ type: ADD_SOLUTION_TO_STATE, payload: solution });
      }
    })
    .catch((error) => {
      console.log('Error in submitSolutionToServer in actions_solutions', error.response ? error.reponse.data : error);
      dispatch({ type: SUBMIT_SOLUTION_FAIL, payload: error.response ? error.reponse.data : error});
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

export const updateSolutionStatus = (solution) => (
  (dispatch) => {
    console.log('updateSolutionStatus() not functional');
    dispatch({ type: UPDATE_SOLUTION_STATUS, payload: solution });

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
export const clarifySolution = ({ solution, message }) => (
  (dispatch) => {
    dispatch({ type: CLARIFY_SOLUTION });

    const token = localStorage.getItem('token');
    http.post('/clarifySolution', { authorization: token, solution, message })
    .then(() => {
      console.log('clarifySolution() Success');
      dispatch({ type: CLARIFY_SOLUTION_SUCCESS, payload: solution });
    })
    .catch((error) => {
      console.log('clarifySolution() Fail');
      console.log(error);
      dispatch({ type: CLARIFY_SOLUTION_FAIL, payload: solution });
    });
  }
);

export const rejectSolution = ({solution, message}) => (
  (dispatch) => {
    dispatch({ type: REJECT_SOLUTION });

    const token = localStorage.getItem('token');
    http.post('/rejectSolution', { authorization: token, solution, message })
    .then(() => {
      console.log('clarifySolution() Success');
      dispatch({ type: REJECT_SOLUTION_SUCCESS, payload: solution });
    })
    .catch((error) => {
      console.log('clarifySolution() Fail');
      console.log('Error: ', error);
      dispatch({ type: REJECT_SOLUTION_FAIL, payload: solution });
    });
  }
);

export const addSolutionUpvote = solution => (
  (dispatch, getState) => {
    dispatch({ type: ADD_SOLUTION_UPVOTE, payload: solution });
    const { solutionUpvotes, solutionDownvotes } = getState().user;

    // If downvote exists remove it
    if (solutionDownvotes.includes(solution.id)) {
      dispatch(removeSolutionDownvote(solution));
    }

    const token = getState().auth.token;
    http.post('/submitSolutionVote', { solution, upvote: 1, downvote: 0, authorization: token })
    .catch(error => console.log('Error in addSolutionUpvote in actions_solutions', error.response.data));
  }
);

export const addSolutionDownvote = solution => (
  (dispatch, getState) => {
    dispatch({ type: ADD_SOLUTION_DOWNVOTE, payload: solution });
    const { solutionDownvotes, solutionUpvotes } = getState().user;

    // If upvote exists remove it
    if (solutionUpvotes.includes(solution.id)) {
      dispatch(removeSolutionUpvote(solution));
    }

    const token = getState().auth.token;
    http.post('/submitSolutionVote', { solution, upvote: 0, downvote: 1, authorization: token })
    .catch(error => console.log('Error in addSolutionDownvote in actions_solutions', error.response.data));
  }
);

export const removeSolutionUpvote = solution => (
  (dispatch, getState) => {
    dispatch({ type: REMOVE_SOLUTION_UPVOTE, payload: solution });
    const { solutionUpvotes } = getState().user;

    const token = getState().auth.token;
    http.post('/removeSolutionVote', { solution, upvote: 1, downvote: 0, authorization: token })
    .catch(error => console.log('Error in removeSolutionUpvote in actions_solutions', error.response.data));
  }
);

export const removeSolutionDownvote = solution => (
  (dispatch, getState) => {
    dispatch({ type: REMOVE_SOLUTION_DOWNVOTE, payload: solution });
    const { solutionDownvotes } = getState().user;

    const token = getState().auth.token;
    http.post('/removeSolutionVote', { solution, upvote: 0, downvote: 1, authorization: token })
    .catch(error => console.log('Error in removeSolutionDownvote in actions_solutions', error.response.data));
  }
);
