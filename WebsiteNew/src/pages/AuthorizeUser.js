import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authorizeUser } from '../actions';

// Import components
import SigninDescription from '../components/SigninDescription';
import LogoHeader from '../components/LogoHeader';

class AuthorizeUser extends Component {
  constructor(props) {
    super(props);
    this.state = { code: '' };
  }

  handleSubmit = () => {
    this.props.authorizeUser(this.props.email, this.state.code);
  }

  render() {
    return (
      <div>
        <SigninDescription />
        <LogoHeader />

        <div>
          <label>Authorization Code:</label>
          <input
            type='text'
            className='form-control'
            placeholder='Authorization code'
            value={this.state.code}
            style={{ width: 300 }}
            onChange={event => this.setState({ code: event.target.value }) }
          />
          <button
            type='button'
            className='btn btn-primary'
            onClick={this.handleSubmit}
          >
            Sign in
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

export default connect(mapStateToProps, { authorizeUser })(AuthorizeUser);
