import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { sendAuthorizationEmail } from '../redux/actions';

// Import components
import SigninDescription from '../components/SigninDescription';
import LogoHeader from '../components/LogoHeader';

class SendCode extends Component {
  constructor(props) {
    super(props);
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
        <SigninDescription />
        <LogoHeader />
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
