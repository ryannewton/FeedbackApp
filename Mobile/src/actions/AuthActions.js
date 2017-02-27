'use strict';

// Import Libraries
import { AsyncStorage } from 'react-native';
import firebase from 'firebase';

// Import components & constants
import Submitted from '../scenes/submitted';
import { ROOT_STORAGE } from '../constants';

// Import types & other action creators
import { submitFeedbackToServer } from './FeedbackActions';
import {
	EMAIL_CHANGED,
	SAVE_EMAIL,
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

export const saveEmail = (email) => (
	(dispatch) => {
		dispatch({ type: SAVE_EMAIL, payload: email });
		AsyncStorage.setItem(`${ROOT_STORAGE}email`, email);
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
				// Get JWT and add to AsyncStorage
				user.getToken()
					.then((token) => {
						AsyncStorage.setItem(`${ROOT_STORAGE}token`, token);
						dispatch(signupUserSuccess(token));
					});

				// Save email to AsyncStorage
				dispatch(saveEmail(email));

				// Save password to AsyncStorage
				AsyncStorage.setItem(`${ROOT_STORAGE}password`, password);

				// Navigate to Submitted scene
				const route = {
					type: 'pop-push',
					route: {
						key: 'Submitted',
						component: Submitted
					}
				};
				dispatch(submitFeedbackToServer(route));
			})
			// If signup fails
			.catch(() => {
				dispatch(loginUser({ email, password }));
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
				// Get JWT and add to AsyncStorage
				user.getToken()
					.then((token) => {
						AsyncStorage.setItem(`${ROOT_STORAGE}token`, token);
						dispatch(loginUserSuccess(token));
					});

				// Save email to AsyncStorage
				dispatch(saveEmail(email));

				// Navigate to Submitted scene
				const route = {
					type: 'pop-push',
					route: {
						key: 'Submitted',
						component: Submitted
					}
				};
				dispatch(submitFeedbackToServer(route));
			})
			// If login fails
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
