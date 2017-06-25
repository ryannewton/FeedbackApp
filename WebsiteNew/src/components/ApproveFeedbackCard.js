// Import Libraries
import React, { Component } from 'react';
import TimeAgo from 'react-timeago';
import { Card } from './common';

class ApproveFeedbackCard extends Component {
  approveFeedback = () => {
    console.log('Approving feedback');
    console.log('feedback: ', this.props.feedback.text);
  }

  clarifyFeedback = () => {
    console.log('Clarifying feedback');
    console.log('feedback: ', this.props.feedback.text);

  }

  rejectFeedback = () => {
    console.log('Rejecting feedback');
    console.log('feedback: ', this.props.feedback.text);

  }

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

  renderButtons() {
    return (
      <div style={{ marginTop: 20, marginBottom: 5 }}>
        <button
          type='button'
          onClick={this.approveSolution}
          style={{ ...buttonStyles, backgroundColor: '#6ECFA2' }}
        >
          APPROVE
        </button>
        <button
          type='button'
          onClick={this.clarifySolution}
          style={{ ...buttonStyles, backgroundColor: '#F2C63B' }}
        >
          CLARIFY
        </button>
        <button
          type='button'
          onClick={this.rejectSolution}
          style={{ ...buttonStyles, backgroundColor: '#E5575F' }}
        >
          REJECT
        </button>
      </div>
    );
  }

  render() {
    return (
      <Card>
        {this.renderFeedbackText()}
        {this.renderButtons()}
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
}

export default ApproveFeedbackCard;
