// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';

// Import Components
import OfficialReplyCard from './OfficialReplyCard';
import { Button, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';

// Import Actions
import { submitOfficialReply } from '../redux/actions';

class EditCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOfficialReplyInput: false,
      officialReply: '',
    };
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
      <div>
        Official Reply:
        <OfficialReplyCard text={this.props.feedback.officialReply} />
      </div>
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
      <div style = {{flexDirection:'row'}}>
        <div className="col-md-10" style={{ marginTop:10 }} >
          <FormGroup controlId="formControlsTextarea">
            <ControlLabel>Enter an official reply.</ControlLabel>
            <FormControl componentClass="textarea" placeholder="Enter your reply here. Note that this will be viewable to all users" onChange={event => this.setState({ officialReply: event.target.value })}/>
          </FormGroup>
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
            style={{ ...buttonStyles, backgroundColor: '#00A2FF', marginTop:35 }}
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
      <div className="card col-xs-12" style={{paddingLeft:50, paddingRight:50, paddingTop:10, paddingBottom:10}}>
          {this.renderFeedbackText()}
        <div>
          {this.renderOfficialReplyText()}
          {this.renderOfficialReplyInput()}
        </div>
        <div style={{ float: 'right' }}>
          {this.renderOfficialReplyButton()}
        </div>
      </div>
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
})(EditCard);
