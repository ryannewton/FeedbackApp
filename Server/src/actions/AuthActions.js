// Import Libraries
import axios from 'axios';

// Import types & other action creators
import { pullProjects } from './FeedbackActions';

import {
	SENDING_AUTHORIZATION_EMAIL,
	SENT_AUTHORIZATION_EMAIL,
	AUTHORIZING_USER,
	AUTHORIZE_USER_SUCCESS,
	AUTHORIZE_USER_FAIL,
	LOAD_TOKEN
} from './types';

export const authorizeUserFail = (error) => (
	{
		type: AUTHORIZE_USER_FAIL,
		payload: error
	}
);

export const sendAuthorizationEmail = (email) => (
	(dispatch) => {
		dispatch({ type: SENDING_AUTHORIZATION_EMAIL });

		// Add a new user to our database (or update the passcode of the user)
		return axios.post(`/sendAuthorizationEmail/`, { email })
		// If successful navigate to the login in screen (for post email verification)
		.then((response) => {
			// Change the in-authorization flag in state so we update the component
			dispatch({ type: SENT_AUTHORIZATION_EMAIL });
		})
		.catch((error) => {
			console.log("Error in sendAuthorizationEmail in AuthActions");
			console.log(error);
		});
	}
);

export const authorizeUser = (email, code, adminCode) => (
	(dispatch) => {
		dispatch({ type: AUTHORIZING_USER });

		// Submits the code the user entered from their email
		return axios.post(`/authorizeAdminUser/`, { email, code, adminCode })
		// If successful store the token, repull state from the database, and set state to logged-in
		.then((response) => {
			let token = String(response.data);
			console.log('received token', token)
			localStorage.setItem(`token`, token);
			dispatch(pullProjects(token));
			dispatch({ type: AUTHORIZE_USER_SUCCESS, payload: token });
		})
		// If not, show an error message
		.catch((error) => {
			console.log("Error in loginUser in AuthActions");
			console.log(error);
			dispatch({ type: AUTHORIZE_USER_FAIL, payload: error.message });
		});
	}
);