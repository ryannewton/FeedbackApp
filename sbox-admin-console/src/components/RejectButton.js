// Import Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { Button, Overlay, Popover, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';

// Import actions
import { rejectFeedback, rejectSolution } from '../actions';

class RejectButton extends Component {
  state = {
    show: false,
    message: '',
    error: false,
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
      this.props.rejectSolution({ solution: feedback, message });
    } else {
      this.props.rejectFeedback({ feedback, message });
    }
  }

  maybeRenderRejectInput = () => {
    const { show } = this.state;
    this.props.updateButtonActive(!show);
    this.setState({ show: !show });
  }

  maybeRenderErrorMessage() {
    if (this.state.error) {
      return (
        <center>
          <div style={{ color: 'red' }}>
            Please add a message to help the user understand why this feedback is being rejected.
          </div>
        </center>
      )
    }
    return null;
  }

  render = () => {
    const marginLeft = (this.props.feedback.status === 'complete') ? -50 : 10;
    
    const sortPopover = (
      <Popover
        id={'reject-' + this.props.feedback.id}
        style={{
          ...this.props.style,
          position: 'absolute',
          backgroundColor: 'white',
          width: 350,
          height: 325,
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
          <ControlLabel>Please provide a reason for rejecting this feedback.</ControlLabel>
          <FormControl
            componentClass="textarea"
            style={{ height: 200 }}
            placeholder="Enter your reason here. Note that this will be sent to the member who submitted this feedback."
            onChange={event => this.setState({ message: event.target.value })}
          />
        </FormGroup>
        {this.maybeRenderErrorMessage()}
        <Button onClick={this.handleSubmit}>Send</Button>
      </Popover>
    );

    return (
      <div style={{ position: 'relative' }}>
        <Button
          className="btn btn-danger btn-xs"
          ref="target"
          style={{ position: 'absolute', right:0 }}
          onClick={this.maybeRenderRejectInput}
        >
          Reject
        </Button>
        <Overlay
          rootClose
          show={this.state.show}
          onHide={() => {
            this.props.updateButtonActive(false);
            this.setState({ show: false });
          }}
          placement="right"
          container={this}
          target={() => ReactDOM.findDOMNode(this.refs.target)}
        >
          {sortPopover}
        </Overlay>
      </div>
    );
  }
}

export default connect(null, { rejectFeedback, rejectSolution })(RejectButton);
