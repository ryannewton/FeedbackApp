// Import Libraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import { FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import TextInputForm from './TextInputForm';
import { Card } from './common';

// Import Actions
import { approveFeedback, clarifyFeedback, rejectFeedback } from '../redux/actions';

class ApproveFeedbackCard extends Component {
  state = {
    showRejectInput: false,
    rejectMessage: '',
    showClarifyInput: false,
    clarifyMessage: '',
  };

  renderFeedbackText() {
    const timestamp = new Date(this.props.feedback.date);
    return (
      <div style={{ marginTop: 10, marginBottom: 20 }}>
        <div style={{ fontWeight: 'bold', fontSize: 14 }}>
          {this.props.feedback.text}
        </div>
        <div style={{ fontSize: 10, float: 'right' }}>
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
      <div style={{ marginTop: 20, marginBottom: 5 }}>
        <button
          type="button"
          onClick={() => approveFeedback(feedback)}
          style={{ ...buttonStyles, backgroundColor: '#6ECFA2' }}
        >
          APPROVE
        </button>
        <button
          type="button"
          onClick={() => this.setState({ showClarifyInput: true })}
          style={{ ...buttonStyles, backgroundColor: '#F2C63B' }}
        >
          CLARIFY
        </button>
        <button
          type="button"
          onClick={() => this.setState({ showRejectInput: true })}
          style={{ ...buttonStyles, backgroundColor: '#E5575F' }}
        >
          REJECT
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
        buttonText="SUBMIT REJECTION"
        submitFunction={this.props.rejectFeedback}
        onClose={() => this.setState({ showRejectInput: false })}
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
        buttonText="REQUEST CLARIFICATION"
        submitFunction={this.props.clarifyFeedback}
        onClose={() => this.setState({ showClarifyInput: false })}
        instructionText="Please describe what is unclear."
        placeholderText="Enter your description here. Note that this will be sent to the member who submitted this feedback."
        feedback={this.props.feedback}
      />
    );
  }

  render() {
    return (
      <Card>
        {this.renderFeedbackText()}
        {this.maybeRenderButtons()}
        {this.maybeRenderRejectInput()}
        {this.maybeRenderClarifyInput()}
      </Card>
    );
  }
}

const buttonStyles = {
  marginLeft: 20,
  marginRight: 20,
  width: 100,
  height: 30,
  color: 'white',
  border: 'none',
  borderRadius: 2,
  fontSize: 10,
};

ApproveFeedbackCard.propTypes = {
  feedback: PropTypes.object,
  approveFeedback: PropTypes.func,
  clarifyFeedback: PropTypes.func,
  rejectFeedback: PropTypes.func,
};

export default connect(null, {
  approveFeedback,
  clarifyFeedback,
  rejectFeedback,
})(ApproveFeedbackCard);
