import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authorizeUser, sendAuthorizationEmail, verifyEmail } from '../redux/actions';
import { Panel } from '../components/common';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      code: '',
      error: '',
      groupCode: '',
      sentCode: false,
    };
    this._handleKeyPress = this._handleKeyPress.bind(this)
  }

  handleSubmit = () => {
    const { email, code } = this.state;
    if (email == '' || code == '') {
      this.setState({ error: 'Please enter a valid code!'});
    } else if (this.props.auth.needGroupCode) {
      this.setState({ error: ''})
      this.props.authorizeUser(email, code, this.state.groupCode)
    } else {
      this.setState({ error: ''})
      this.props.verifyEmail(email, code);
    }
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      const { email, code } = this.state;
      this.props.authorizeUser({ email, code });
    }
  }

  maybeRenderErrorMessage = () => {
    if (this.state.error !== '') {
      return (
        <div style={{ color: 'red' }}>
          {this.state.error}
        </div>
      );
    } else if (this.props.auth.error) {
      return (
        <div style={{ color: 'red' }}>
          The entered username and password combination was not recognized in our server.
        </div>
      )
    }
    return null;
  }

  enterCode() {
    if (this.props.auth.authEmailFail) {
      return (
        <div>
          The server is experience an error, please reload and try again.
        </div>
      )
    }else if (this.state.sentCode) {
      return (
        <div>
          <label>Enter Code From Email:</label>
          <input
            type='password'
            className='form-control'
            placeholder='1234'
            value={this.state.code}
            style={{ width: 300 }}
            onChange={event => this.setState({ code: event.target.value }) }
            onKeyPress={this._handleKeyPress}
          />
        </div>
      );
    }
    return (
      <button
          type='button'
          className='btn btn-primary row-centered'
          onClick={() => {
            this.setState({ sentCode: true });
            this.props.sendAuthorizationEmail(this.state.email, 'en');
        }}
        >
        Send Code
      </button>
    );
  }

  groupCode() {
    if (this.props.auth.needGroupCode) {
      return (
        <div>
          <label>Enter Group Code:</label>
          <input
            type='password'
            className='form-control'
            placeholder='1234'
            value={this.state.groupCode}
            style={{ width: 300 }}
            onChange={event => this.setState({ groupCode: event.target.value })}
            onKeyPress={this._handleKeyPress}
          />
        </div>
      );
    }
    return null;
  }

  loginButton() {
    if (this.state.sentCode) {
      return (
        <div style={{paddingLeft:240, paddingTop:20}}>
          <button
              type='button'
              className='btn btn-primary row-centered'
              onClick={this.handleSubmit}
            >
            Login
          </button>
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <div className="row">
        <div style={{paddingLeft:50, paddingRight:50}}>
          <Panel
            title="Sign In"
            hasTitle={true}>
            <div className="col-md-5 col-xs-12 col-md-offset-1" style={{paddingTop:20}}>
              <p>Signing in is easier than ever.</p>
              <p>No need to remember another password.</p>
              <p>1) Enter your email address</p>
              <p>2) Submit the code from your email</p>
              <p>3) We'll remember you in the future</p>
            </div>
            <div className="col-md-5 col-xs-12 col-md-offset-1" style={{paddingTop:10}}>
              <label>Email:</label>
              <input
                type='text'
                className='form-control'
                placeholder='Your email address'
                value={this.state.email}
                style={{ width: 300 }}
                onChange={event => this.setState({ email: event.target.value }) }
              />
              <div style={{paddingTop:20}} />
              {this.enterCode()}
              {this.groupCode()}
              {this.loginButton()}
              {this.maybeRenderErrorMessage()}
            </div>
          </Panel>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { auth, group } = state
  return { auth, group };
}

export default connect(mapStateToProps, {
   authorizeUser,
   sendAuthorizationEmail,
   verifyEmail,
 })(Login);
