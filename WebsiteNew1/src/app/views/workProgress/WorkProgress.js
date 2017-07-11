import React, {
  PropTypes,
  Component
}                         from 'react';
import {
  AnimatedView,
  Panel,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCol
}                         from '../../components';
import shallowCompare     from 'react-addons-shallow-compare';
import Highlight          from 'react-highlight';
import SigninDescription from '../../components/SigninDescription';
import LogoHeader from '../../components/LogoHeader';
import { sendAuthorizationEmail } from '../../actions';
import { connect } from 'react-redux';



class WorkProgress extends Component {
  componentWillMount() {
    const { actions: { enterWorkProgress } } = this.props;
    enterWorkProgress();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUnmount() {
    const { actions: { leaveWorkProgress } } = this.props;
    leaveWorkProgress();
  }
  constructor(props) {
    super(props);
    this.state = { email: props.email || '' };
  }

  handleSubmit = () => {
    this.props.sendAuthorizationEmail(this.state.email);
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


WorkProgress.propTypes= {
  actions: PropTypes.shape({
    enterWorkProgress: PropTypes.func.isRequired,
    leaveWorkProgress: PropTypes.func.isRequired
  })
};

export default connect(mapStateToProps, { sendAuthorizationEmail })(WorkProgress);
