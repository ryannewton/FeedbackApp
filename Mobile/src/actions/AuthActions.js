'use strict';

// Import Libraries
import firebase from 'firebase';

// Import types
import {
	EMAIL_CHANGED,
	PASSWORD_CHANGED,
	PASSWORD_CONFIRM_CHANGED,
	SIGNUP_USER,
	SIGNUP_USER_SUCCESS,
	SIGNUP_USER_FAIL,
	LOGIN_USER,
	LOGIN_USER_SUCCESS,
	LOGIN_USER_FAIL
} from './types';

export const emailChanged = (email) => (
	{
		type: EMAIL_CHANGED,
		payload: email
	}
);

export const passwordChanged = (password) => (
	{
		type: PASSWORD_CHANGED,
		payload: password
	}
);

export const passwordConfirmChanged = (passwordConfirm) => (
	{
		type: PASSWORD_CONFIRM_CHANGED,
		payload: passwordConfirm
	}
);

export const signupUser = ({ email, password }) => (
	(dispatch) => {
		dispatch({ type: SIGNUP_USER });

		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then((user) => {
				dispatch(signupUserSuccess(user));
				// To do: Navigate away after success
			})
			.catch(() => {
				dispatch(signupUserFail('Email address is already in use'));
			});
	}
);

export const signupUserSuccess = (user) => (
	{
		type: SIGNUP_USER_SUCCESS,
		payload: user
	}
);

export const signupUserFail = (err) => (
	{
		type: SIGNUP_USER_FAIL,
		payload: err
	}
);

export const loginUser = ({ email, password }) => (
	(dispatch) => {
		dispatch({ type: LOGIN_USER });

		firebase.auth().signInWithEmailAndPassword(email, password)
		.then((user) => {
			dispatch(loginUserSuccess(user));
			// To do: Navigate away
		})
		.catch(() => dispatch(loginUserFail()));
	}
);

export const loginUserSuccess = (user) => (
	{
		type: LOGIN_USER_SUCCESS,
		payload: user
	}
);

export const loginUserFail = () => {
	const err = 'Login failed. Invalid email or password';
	return {
		type: LOGIN_USER_FAIL,
		payload: err
	};
};
