// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';

// Import Components
import { Card } from './common';
import OfficialReplyCard from './OfficialReplyCard';

// Import Actions
import { submitOfficialReply } from '../actions';

class ManageFeedbackCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOfficialReplyInput: false,
      officialReply: '',
    }
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

  renderOfficialReplyText() {
    let { officialReply } = this.props.feedback;
    // officialReply = 'This is an official reply';
    // Don't render if there is no official reply
    if (!officialReply) {
      return null;
    }

    return (
      <OfficialReplyCard text={this.props.feedback.officialReply} />
    );
  }

  renderOfficialReplyButton() {
    // Don't show if Official Reply input box is already displayed
    if (this.state.showOfficialReplyInput) {
      return null;
    }

    return (
      <button
        type='button'
        onClick={() => this.setState({ showOfficialReplyInput: true })}
        style={{ ...buttonStyles, backgroundColor: '#00A2FF' }}
      >
        OFFICIAL REPLY
      </button>
    );
  }

  renderOfficialReplyInput() {
    if (!this.state.showOfficialReplyInput) {
      return null;
    }

    return (
      <div>
        <div>
          <div>Enter an official reply.</div>
          <small>Note: This will be viewable to all users.</small>
        </div>
        <div className="col-md-10">
          <input
            type="text"
            className="form-control"
            placeholder="Official Reply"
            value={this.state.officialReply}
            onChange={event => this.setState({ officialReply: event.target.value })}
            style={{ height: 120, marginRight: 0 }}
          />
        </div>
        <div>
          <button
            type='button'
            onClick={() => {
              const { feedback } = this.props;
              const { officialReply } = this.state;
              this.props.submitOfficialReply({ feedback, officialReply });
              this.setState({ showOfficialReplyInput: false });
            }}
            style={{ ...buttonStyles, backgroundColor: '#00A2FF' }}
          >
            SUBMIT REPLY
          </button>
        </div>
        <div>
          <button
            type='button'
            onClick={() => this.setState({ showOfficialReplyInput: false })}
            style={{ ...buttonStyles, backgroundColor: '#00A2FF' }}
          >
            DISMISS
          </button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Card>
        {this.renderFeedbackText()}
        <div style={{ float: 'right' }}>
          {this.renderOfficialReplyButton()}
        </div>
        {this.renderOfficialReplyText()}
        {this.renderOfficialReplyInput()}
      </Card>
    );
  }
}

const buttonStyles = {
  margin: 5,
  width: 90,
  height: 30,
  color: 'white',
  border: 'none',
  borderRadius: 2,
  fontSize: 10,
}

export default connect(null, {
  submitOfficialReply,
})(ManageFeedbackCard);
