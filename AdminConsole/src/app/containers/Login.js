import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authorizeUser } from '../redux/actions';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      code: '',
    };
  }

  handleSubmit = () => {
    const { email, code } = this.state;
    this.props.authorizeUser({ email, code });
  }

  render() {
    return (
      <div>
        <div>
          <p>Signing in is easier than ever. No need to remember another password.</p>
          <p>1) Enter your email address</p>
          <p>2) Submit the code from your email</p>
          <p>3) We'll remember you in the future</p>
        </div>
        <p>Suggestion Box App</p>
        <div>
          <label>Email:</label>
          <input
            type='text'
            className='form-control'
            placeholder='Your email address'
            value={this.state.email}
            style={{ width: 300 }}
            onChange={event => this.setState({ email: event.target.value }) }
          />
          <label>Administrator Password:</label>
          <input
            type='text'
            className='form-control'
            placeholder='Your email address'
            value={this.state.code}
            style={{ width: 300 }}
            onChange={event => this.setState({ code: event.target.value }) }
          />
          <button
            type='button'
            className='btn btn-primary'
            onClick={this.handleSubmit}
          >
            Login
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { authorizeUser })(Login);
