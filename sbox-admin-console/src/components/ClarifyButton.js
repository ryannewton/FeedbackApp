// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { Button, Overlay, Popover, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';

// Import actions
import { clarifyFeedback, clarifySolution } from '../actions';

class ClarifyButton extends Component {
  state = {
    show: false,
    message: '',
    error: false,
    sent: false,
  }

  handleSubmit = () => {
    if (!this.state.message) {
      this.setState({ error: true });
      return null;
    }

    this.setState({ error: false });
    const { message } = this.state;
    const { feedback } = this.props;
    if (this.props.feedback.feedbackId) {
      this.props.clarifySolution({ solution: feedback, message });
    } else {
      this.props.clarifyFeedback({ feedback, message });
    }
    this.setState({ sent: true });
  }

  maybeRenderClarifyInput = () => {
    const { show } = this.state;
    this.props.updateButtonActive(!show);
    this.setState({ show: !show });
  }

  maybeRenderErrorMessage() {
    if (this.state.error) {
      return (
        <center>
          <div style={{ color: 'red' }}>
            Please add a message to help the user understand what to clarify.
          </div>
        </center>
      )
    }
    return null;
  }

  maybeRenderSentMessage() {
    if (this.state.sent) {
      return (
        <center>
          <div style={{ color: 'blue' }}>
            Sent!
          </div>
        </center>
      )
    }
  }

  render = () => {
    const marginLeft = (this.props.feedback.status === 'complete') ? -50 : 10;
    
    const sortPopover = (
      <Popover
        id={'clarify-' + this.props.feedback.id}
        style={{
          ...this.props.style,
          position: 'absolute',
          backgroundColor: 'white',
          boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
          border: '1px solid #CCC',
          borderRadius: 3,
          marginLeft: marginLeft,
          marginTop: 0,
          padding: 10,
          textAlign: 'left',
          fontSize: 12,
        }}
      >
        <FormGroup controlId="formControlsTextarea">
          <ControlLabel>Please describe what is unclear.</ControlLabel>
          <FormControl
            componentClass="textarea"
            placeholder="Enter your description here. Note that this will be sent to the member who submitted this feedback."
            onChange={event => this.setState({ message: event.target.value })}
          />
        </FormGroup>
        {this.maybeRenderErrorMessage()}
        {this.maybeRenderSentMessage()}
        <Button onClick={this.handleSubmit}>Send</Button>
      </Popover>
    );

    return (
      <div style={{ position: 'relative'}}>
        <Button
          className="btn btn-warning btn-sm"
          style={{ position: 'absolute', right:56 }}
          ref="target"
          onClick={this.maybeRenderClarifyInput}
        >
          Clarify
        </Button>
        <Overlay
          rootClose
          show={this.state.show}
          onHide={() => {
            this.props.updateButtonActive(false);
            this.setState({ show: false });
          }}
          placement="bottom"
          container={this}
          target={() => ReactDOM.findDOMNode(this.refs.target)}
        >
          {sortPopover}
        </Overlay>
      </div>
    );
  }
}

export default connect(null, { clarifyFeedback, clarifySolution })(ClarifyButton);
