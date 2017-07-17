// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import { Card } from './common';

// Import Actions
import { approveFeedback, clarifyFeedback, rejectFeedback } from '../redux/actions';

class ApproveFeedbackCard extends Component {

  //Text, Image, Status, Votes, Solutions, Response, Category, Group, Approved, Date, Translated From
  render() {
    return (
      <div className='clearfix'>
        <Card>
          {this.renderFeedbackText()}
        </Card>
        <div className='pull-right'>
          {this.renderActionButtons()}
        </div>
      </div>
    );
  }

  renderFeedbackText = () => {
    console.log(this.props.feedback);
    const timestamp = new Date(this.props.feedback.date);
    return (
      <div style={{ marginTop: 10, marginBottom: 20 }}>
        <div style={{ fontWeight: 'bold', fontSize: 14 }}>
          {this.props.feedback.text}
        </div>
        <div style={{ fontSize: 8 }}>
          {this.props.feedback.approved}
          {this.props.feedback.category}
          {this.props.feedback.status}
          {this.props.feedback.approved}
        </div>
        <div style={{ fontSize: 10, float: 'right' }}>
          Submitted <TimeAgo date={timestamp} />
        </div>
      </div>
    );
  }

  renderActionButtons = () => {
    return (
      <div>
        <button>Reply</button>
        <button>View Solutions</button>
        <button>Update</button>
      </div>
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

export default connect(null, {
  approveFeedback,
  clarifyFeedback,
  rejectFeedback
})(ApproveFeedbackCard);
