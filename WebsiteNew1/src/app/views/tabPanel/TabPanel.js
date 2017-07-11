import React, {
  PropTypes,
  Component
}                         from 'react';
import {
  AnimatedView,
  Panel,
}                         from '../../components';
import shallowCompare     from 'react-addons-shallow-compare';
import Highlight          from 'react-highlight';
import SigninDescription from '../../components/SigninDescription';
import LogoHeader from '../../components/LogoHeader';
import { authorizeUser } from '../../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router'



class TabPanel extends Component {
  componentWillMount() {
    const { actions: { enterTabPanel } } = this.props;
    enterTabPanel();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUnmount() {
    const { actions: { leaveTabPanel } } = this.props;
    leaveTabPanel();
  }

  constructor(props) {
    super(props);
    this.state = { authCode: '', adminCode: '' };
  }

  handleSubmit = () => {
    const { email } = this.props;
    const { authCode, adminCode } = this.state;
    this.props.authorizeUser(email, authCode, adminCode);
  }

  renderAuth() {
    console.log(this.props)
    const { emailSentSuccess, loading } = this.props;
    if (loading) {
      return (
        <div>
          loading
        </div>
      );
    }
    if (emailSentSuccess) {
      return (
        <div style={{paddingLeft: 50}}>
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
              <hr />
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
              <Link to={'/'}>
                <button
                  type="button"
                  onClick={this.handleSubmit}
                  className="btn btn-primary"
                  style={{ marginTop: 5 }}
                >
                  Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        Authentication failed! Please try again.
        <Link to={'/Dashboard/workProgress'}>
          <button
            type='button'
            className='btn btn-primary'
            onClick={this.handleSubmit}
          >
          Login again!
        </button>
        </Link>
      </div>
    );
  }

  render() {
    return (
      this.renderAuth()
    );
  }
}

function mapStateToProps(state) {
  const { email, emailSentSuccess, loading } = state.auth;
  return { email, emailSentSuccess, loading };
}


TabPanel.propTypes= {
  actions: PropTypes.shape({
    enterTabPanel: PropTypes.func.isRequired,
    leaveTabPanel: PropTypes.func.isRequired
  })
};

export default connect(mapStateToProps, { authorizeUser })(TabPanel);
