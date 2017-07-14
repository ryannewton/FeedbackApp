import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { authorizeUser } from '../redux/actions';

// Import components
import SigninDescription from '../components/SigninDescription';
import LogoHeader from '../components/LogoHeader';

class AuthorizeUser extends Component {
  constructor(props) {
    super(props);
    this.state = { authCode: '', adminCode: '' };
  }

  handleSubmit = () => {
    const { email, history } = this.props;
    const { authCode, adminCode } = this.state;
    this.props.authorizeUser({ email, authCode, adminCode, history });
  }

  render() {
    return (
      <div>
        <SigninDescription />
        <LogoHeader />

        {/* Email input */}
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Verify Your University Affiliation</h3>
          </div>
          <div className="panel-body">
            <div className="input-group" style={{ marginTop: 10 }}>
              <span className="input-group-addon">
                Authentication Code (check your email)
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Authentication code"
                value={this.state.authCode}
                onChange={event => this.setState({ authCode: event.target.value })}
                style={{ width: 300 }}
              />
            </div>
            <div className="input-group">
              <span className="input-group-addon">
                Admin Code
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Admin code"
                value={this.state.adminCode}
                onChange={event => this.setState({ adminCode: event.target.value })}
                style={{ width: 300 }}
              />
            </div>
            <button
              type="button"
              onClick={this.handleSubmit}
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

function mapStateToProps(state) {
  const { email } = state.auth;
  return { email };
}

export default withRouter(connect(mapStateToProps, { authorizeUser })(AuthorizeUser));
