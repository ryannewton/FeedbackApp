// Import Libraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import { FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import TextInputForm from './TextInputForm';
import { Panel } from './common';
import { Button } from 'react-bootstrap';

// Import Actions
import { approveFeedback, clarifyFeedback, rejectFeedback, updateFeedbackStatus } from '../redux/actions';

class ApproveFeedbackCard extends Component {
  state = {
    showRejectInput: false,
    rejectMessage: '',
    showClarifyInput: false,
    clarifyNothingSubmitted: false,
    rejectNothingSubmitted: false,
  };

  renderFeedbackText = () => {
    const timestamp = new Date(this.props.feedback.date);
    return (
      <div style={{ marginTop: 10, marginBottom: 20 }}>
        <div className="pull-left" style={{ fontWeight: 'bold', fontSize: 14 }}>
          <p style={{color:'#48D2A0'}}>▲ {this.props.feedback.upvotes}</p><p style={{color:'#F54B5E'}}>▼ {this.props.feedback.downvotes}</p>
        </div>
        <div className="col-xs-offset-1" style={{ fontWeight: 'bold', fontSize: 14 }}>
          {this.props.feedback.text}
        </div>
        <div className="pull-right" style={{ fontSize: 10}}>
          Submitted <TimeAgo date={timestamp} />
        </div>
      </div>
    );
  }

  maybeRenderButtons() {
    const { feedback, approveFeedback, clarifyFeedback, rejectFeedback } = this.props;
    if (this.state.showRejectInput || this.state.showClarifyInput) {
      return null;
    }

    return (
      <div className="col-xs-offset-1" style={{ marginTop: 20, marginBottom: 5 }}>
        <button
          type="button"
          className="btn btn-success"
          style={{ ...buttonStyles, backgroundColor:'#6ECFA2' }}
          onClick={() => approveFeedback(feedback)}
        >
          Approve
        </button>
        <button
          type="button"
          className="btn btn-warning"
          onClick={() => this.setState({ showClarifyInput: true })}
          style={{ ...buttonStyles, backgroundColor: '#F2C63B' }}
        >
          Clarify
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => this.setState({ showRejectInput: true })}
          style={{ ...buttonStyles, backgroundColor: '#E5575F' }}
        >
          Reject
        </button>
      </div>
    );
  }

  maybeRenderRejectInput() {
    if (!this.state.showRejectInput) {
      return null;
    }

    return (
      <TextInputForm
        buttonColor="#E5575F"
        buttonText="Submit Rejection"
          submitFunction={ ({ feedback, message }) => {
            if (message == '') {
              this.setState({ rejectNothingSubmitted: true})
            } else {
              this.setState({ rejectNothingSubmitted: false})
              this.props.rejectFeedback({ feedback, message });
              this.props.updateFeedbackStatus({ feedback, newStatus: 'rejected' });
            }
          }}
        onClose={() => this.setState({ showRejectInput: false, rejectNothingSubmitted: false })}
        instructionText="Please provide a reason for rejecting this feedback."
        placeholderText="Enter your reason here. Note that this will be sent to the member who submitted this feedback."
        feedback={this.props.feedback}
      />
    );
  }

  maybeRenderClarifyInput() {
    if (!this.state.showClarifyInput) {
      return null;
    }

    return (
      <TextInputForm
        buttonColor="#F2C63B"
        buttonText="Request Clarification"
        submitFunction={ ({ feedback, message }) => {
          if (message == '') {
            this.setState({ clarifyNothingSubmitted: true})
          } else {
            this.setState({ clarifyNothingSubmitted: false})
            this.props.clarifyFeedback({ feedback, message });
            this.props.updateFeedbackStatus({ feedback, newStatus: 'clarify' });
          }
        }}
        onClose={() => this.setState({ showClarifyInput: false, clarifyNothingSubmitted: false })}
        instructionText="Please describe what is unclear."
        placeholderText="Enter your description here. Note that this will be sent to the member who submitted this feedback."
        feedback={this.props.feedback}
      />
    );
  }

  maybeRenderErrorMessage() {
    if (this.state.clarifyNothingSubmitted) {
      return (
        <center>
          <div style={{color: 'red'}}>
            Please add a message to help the user understand what to clarify.
          </div>
        </center>
      )
    } else if (this.state.rejectNothingSubmitted) {
      return (
        <center>
          <div style={{color: 'red'}}>
            Please add a message to help the user understand why this feedback is being rejected.
          </div>
        </center>
      )
    }
    return null;
  }

  render() {
    return (
      <div>
        <Panel hasTitle={false}>
          {this.renderFeedbackText()}
          {this.maybeRenderButtons()}
          {this.maybeRenderRejectInput()}
          {this.maybeRenderClarifyInput()}
        </Panel>
        {this.maybeRenderErrorMessage()}
      </div>
    );
  }
}

const buttonStyles = {
  marginLeft: 20,
  marginRight: 20,
  width: 100,
};

ApproveFeedbackCard.propTypes = {
  feedback: PropTypes.object,
  approveFeedback: PropTypes.func,
  clarifyFeedback: PropTypes.func,
  rejectFeedback: PropTypes.func,
  updateFeedbackStatus: PropTypes.func,
};

export default connect(null, {
  approveFeedback,
  clarifyFeedback,
  rejectFeedback,
  updateFeedbackStatus,
})(ApproveFeedbackCard);
