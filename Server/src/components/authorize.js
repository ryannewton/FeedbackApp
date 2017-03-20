'use strict';

// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import components and action creators
import { authorizeUser, sendAuthorizationEmail, authorizeUserFail  } from '../actions';

class Authorize extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			code: '',
			adminCode: ''
		}

		this.onSendAuthorizationEmailButtonPress = this.onSendAuthorizationEmailButtonPress.bind(this);
		this.onLoginButtonPress = this.onLoginButtonPress.bind(this);
	}

	onLoginButtonPress() {
		this.props.authorizeUser(this.state.email, this.state.code, this.state.adminCode);
	}

	onSendAuthorizationEmailButtonPress() {
		let re = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)*(?:hbs\.edu|stanford\.edu)$/;
		if (re.test(this.state.email)) {
			this.props.sendAuthorizationEmail(this.state.email);
		} else {
			this.props.authorizeUserFail("Invalid Email Address");
		}		
	}

	render() {
		return (
			<div>
				<div>
					Verify Your University
				</div>

				
				<div>
					{/* Email input */}
					<div>
						<input
							type="text"
							placeholder="my_username@my_university.edu"
							value={this.state.email}
							onChange={(event) => this.setState({email: event.target.value})}
						/>
					</div>

					{/* Error message (blank if no error) */}
					<div>
						{this.props.error}							
					</div>

					{/* Confirmation button, and 'go to login' button */}						
					<button onClick={this.onSendAuthorizationEmailButtonPress}>Send Email to Verify Email Address</button>					

					<div>
						Why do we need your email? Two reasons:{'\n'}
						1) We need to confirm you are member of your university{'\n'}
						2) We will keep you updated as changes are made based on your feedback
					</div>
				</div>


				<div>
					Enter Code From Email
				</div>


				<div>
					{/* Email input */}
					<input
						type="text"
						placeholder="Enter code here"
						value={this.state.code}
						onChange={(event) => this.setState({ code: event.target.value })}
					/>
					<input
						type="text"
						placeholder="Enter admin code here"
						value={this.state.adminCode}
						onChange={(event) => this.setState({ adminCode: event.target.value })}
					/>

					{/* Error message (blank if no error) */}
					<div>
						{this.props.error}
					</div>

					{/* Confirmation button, and 'go to login' button */}
					<button onClick={this.onLoginButtonPress}>Login</button>

					<div>
							We sent you an email with a 4 digit code.{'\n'}
							Please enter it here to verify your email address{'\n'}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { email, error, loading } = state.auth;
	return { email, error, loading };
};

export default connect(mapStateToProps, { authorizeUser })(Authorize);
