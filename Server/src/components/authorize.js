// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import components and action creators
import { authorizeUser, sendAuthorizationEmail, authorizeUserFail } from '../actions';

class Authorize extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      code: '',
      adminCode: '',
    };

    this.onSendAuthorizationEmailButtonPress = this.onSendAuthorizationEmailButtonPress.bind(this);
    this.onLoginButtonPress = this.onLoginButtonPress.bind(this);
  }

  onLoginButtonPress() {
    this.props.authorizeUser(this.state.email, this.state.code, this.state.adminCode);
  }

  onSendAuthorizationEmailButtonPress() {
    const re = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)*(?:hbs\.edu|stanford\.edu)$/;
    if (re.test(this.state.email)) {
      this.props.sendAuthorizationEmail(this.state.email);
    } else {
      this.props.authorizeUserFail('Invalid Email Address');
    }
  }

  render() {
    return (
      <div>
        {/* Email input */}
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Verify Your University Affiliation</h3>
          </div>
          <div className="panel-body">
            <span className="input-group">
              <span
                className="input-group-addon"
              >
                School Email Address
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="my_username@my_university.edu"
                value={this.state.email}
                onChange={event => this.setState({ email: event.target.value })}
                style={{ width: 300 }}
              />
            </span>
            <button
              type="button"
              onClick={this.onSendAuthorizationEmailButtonPress}
              className="btn btn-primary"
              style={{ marginTop: 5 }}
            >
                Send Verification Email
            </button>

            <div className="input-group" style={{ marginTop: 10 }}>
              <span
                className="input-group-addon"
              >
                Enter Code From Email
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Enter code here"
                value={this.state.code}
                onChange={event => this.setState({ code: event.target.value })}
                style={{ width: 300 }}
              />
            </div>
            <div className="input-group">
              <span
                className="input-group-addon"
              >
                Enter Admin Code
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Enter admin code here"
                value={this.state.adminCode}
                onChange={event => this.setState({ adminCode: event.target.value })}
                style={{ width: 300 }}
              />
            </div>
            <button
              type="button"
              onClick={this.onLoginButtonPress}
              className="btn btn-primary"
              style={{ marginTop: 5 }}
            >
                Login
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { error, loading } = state.auth;
  return { error, loading };
};

export default connect(mapStateToProps, {
  authorizeUser,
  sendAuthorizationEmail,
  authorizeUserFail,
})(Authorize);
