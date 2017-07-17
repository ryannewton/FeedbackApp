import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { sendAuthorizationEmail } from '../redux/actions';

class SendCode extends Component {
  constructor(props) {
    super(props);
    console.log('props', props);
    this.state = { email: props.email || '' };
  }

  handleSubmit = () => {
    const { history } = this.props;
    const { email } = this.state;
    this.props.sendAuthorizationEmail({ email, history });
  }

  logoSection() {
    return (
      <p>Suggestion Box App</p>
    );
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
          <button
            type='button'
            className='btn btn-primary'
            onClick={this.handleSubmit}
          >
            Get Code
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { email } = state.auth;
  return { email };
}

export default withRouter(connect(mapStateToProps, { sendAuthorizationEmail })(SendCode));
